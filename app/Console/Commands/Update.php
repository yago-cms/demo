<?php

namespace App\Console\Commands;

use GuzzleHttp\Client;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Spatie\TemporaryDirectory\TemporaryDirectory;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Symfony\Component\Process\Process;

class Update extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'yago:update';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update YAGO Content Core.';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $client = new Client([
            'base_uri' => 'https://api.github.com',
        ]);

        // Get tags
        $this->output->section("Download");
        $this->output->writeln("Fetching latest release...");

        $response = $client->request('GET', '/repos/yago-cms/yago-content/tags', [
            'headers' => [
                'Accept' => 'application/vnd.github.v3+json',
            ]
        ]);

        $tags = json_decode($response->getBody());
        $releases = [];

        foreach ($tags as $tag) {
            if ($tag->name[0] === 'v') {
                $releases[$tag->name] = $tag;
            }
        }

        $release = collect($releases)->first();

        $this->output->info("Latest release is {$release->name}");

        if ($this->output->confirm("YAGO Content will be updated to {$release->name}. Are you sure you want to continue?", true)) {
            $sha = substr($release->commit->sha, 0, 7);

            // Get zipball
            $this->output->writeln("Downloading latest release...");
            $response = $client->request('GET', $release->zipball_url);

            // Extract tarball to temporary directory
            $tmpDirectory = (new TemporaryDirectory())
                ->create();
            $tmpZip = $tmpDirectory->path($release->name);

            file_put_contents($tmpZip, $response->getBody());

            try {
                $this->output->writeln("Unpacking latest release in temporary directory...");

                $zip = new \ZipArchive();
                $zip->open($tmpZip);
                $zip->extractTo($tmpDirectory->path());
                $zip->close();
            } catch (\Exception $e) {
                throw new \Error($e->getMessage());
            }

            $this->output->section("Copy files");
            $this->output->writeln("Copying files...");
            $this->output->newLine();

            $sourceRootPath = $tmpDirectory->path("yago-cms-yago-content-{$sha}");
            $destinationRootPath = base_path();

            // TODO: Figure out why CHANGELOG.md is not in the release
            // TODO: Parse composer.json and extract any dependencies that needs to be kept

            $includePaths = [
                '.yago',
                'app',
                'bootstrap',
                'config',
                'database',
                'graphql',
                'packages',
                'resources',
                'routes',
                'tests',
                'composer.json',
                'composer.lock',
                'Envoy.blade.php',
                'package-lock.json',
                'package.json',
                'phpunit.xml',
                'README.md',
                '.gitignore'
                // 'CHANGELOG.md',
            ];

            $listing = [];

            foreach ($includePaths as $includePath) {
                $sourcePath = "$sourceRootPath/$includePath";
                $destinationPath = "$destinationRootPath/$includePath";

                if (!File::exists($sourcePath)) {
                    $this->output->error("File not found in extracted archive: {$sourcePath}");

                    return -1;
                }

                if (File::isDirectory($sourcePath)) {
                    $listing[] = "Copying directory $includePath to {$destinationPath}.";

                    File::copyDirectory($sourcePath, $destinationPath);
                } else if (File::isFile($sourcePath)) {
                    $listing[] = "Copying file $includePath to {$destinationPath}.";

                    File::copy($sourcePath, $destinationPath);
                }
            }

            $this->output->listing($listing);

            $this->output->section("Composer");
            $this->output->writeln("Installing composer dependencies...");

            $process = new Process(['php', '-dxdebug.mode=off', '/usr/bin/composer', 'install']);
            $process->setWorkingDirectory(base_path());
            $process->setEnv([
                'COMPOSER_HOME' => '/root/.config/composer',
            ]);

            try {
                $process->mustRun();

                $this->output->block(trim($process->getOutput()));
            } catch (ProcessFailedException $exception) {
                $this->error("composer install failed: {$exception->getMessage()}");
                return -1;
            }

            $this->output->section("Migrations");
            $this->output->writeln("Running migrations...");

            $process = new Process(['php', 'artisan', 'migrate', '--force']);
            $process->setTimeout(3600);

            try {
                $process->mustRun();

                $this->output->block(trim($process->getOutput()));
            } catch (ProcessFailedException $exception) {
                $this->error("artisan migrate --force failed: {$exception->getMessage()}");
                return -1;
            }

            $this->output->section("Node");
            $this->output->writeln("Installing npm dependencies...");

            $process = new Process(['npm', 'install']);
            $process->setTimeout(3600);

            try {
                $process->mustRun();

                $this->output->block(trim($process->getOutput()));
            } catch (ProcessFailedException $exception) {
                $this->error("npm install failed: {$exception->getMessage()}");
                return -1;
            }

            $this->newLine();

            $this->output->success("File system update complete.");

            $tmpDirectory->delete();

            if ($this->output->confirm("Do you want to rebuild JS & CSS assets?", true)) {
                $this->output->section("Build");
                $this->output->writeln("Building development assets...");

                $process = new Process(['/usr/bin/npm', 'run', 'dev']);
                $process->setWorkingDirectory(base_path() . '/packages/backend/');
                $process->setEnv([
                    'HOME' => '/var/www/html',
                    'PATH' => '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
                ]);
                $process->setTimeout(3600);

                try {
                    $process->mustRun();

                    // $this->output->block($process->getOutput());
                } catch (ProcessFailedException $exception) {
                    $this->error("npm run dev failed: {$exception->getMessage()}");
                    return -1;
                }

                $this->output->success("Build complete");
            }
        }

        return 0;
    }
}
