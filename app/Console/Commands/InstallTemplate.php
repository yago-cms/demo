<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class InstallTemplate extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'yago:install-template {name}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Install a template';

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
        $name = $this->argument('name');
        $sourcePath = ".yago/templates/{$name}";
        $destinationPath = 'packages/frontend/src';
        $resourcePaths = [
            'packages/frontend/src/js',
            'packages/frontend/src/sass',
            'packages/frontend/src/views',
        ];

        if ($this->confirm('This will overwrite any existing assets. Are you sure you want to continue?', true)) {
            if (!File::exists($sourcePath)) {
                $this->error("Could not find template \"{$name}\".");
                return 0;
            }

            foreach ($resourcePaths as $resourcePath) {
                $this->info("Removing files in $resourcePath");
                File::deleteDirectory($resourcePath);
            }

            $this->info("Copying files in from $sourcePath to $destinationPath");
            File::copyDirectory($sourcePath, $destinationPath);

            File::move($destinationPath . '/package.json', $destinationPath . '/../package.json');
        }

        return 0;
    }
}
