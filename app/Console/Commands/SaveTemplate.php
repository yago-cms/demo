<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class SaveTemplate extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'yago:save-template {name}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Save frontend assets to a template';

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
        $sourcePath = 'packages/frontend/src';
        $destinationPath = ".yago/templates/{$name}";
        $resourcePaths = [
            'js' => 'packages/frontend/src/js',
            'sass' => 'packages/frontend/src/sass',
            'views' => 'packages/frontend/src/views',
        ];

        if ($this->confirm('This will overwrite any existing template. Are you sure you want to continue', true)) {
            $this->info("Removing files in $destinationPath");

            File::deleteDirectory($destinationPath);
            File::makeDirectory($destinationPath);

            $this->info("Copying files in from $sourcePath to $destinationPath");
            foreach ($resourcePaths as $folder => $resourcePath) {
                File::copyDirectory($resourcePath, $destinationPath . '/' . $folder);
            }

            File::copy($sourcePath . '/../package.json', $destinationPath . '/package.json');
        }

        return 0;
    }
}
