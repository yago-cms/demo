<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class MySqlDump extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:dump';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Runs the mysqldump utility using info from .env';

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
        $ds = DIRECTORY_SEPARATOR;

        $host = env('DB_HOST');
        $username = env('DB_USERNAME');
        $password = env('DB_PASSWORD');
        $database = env('DB_DATABASE');

        $ts = time();

        $path = database_path() . $ds . 'backups' . $ds;
        $file = 'db.sql';
        $command = sprintf('mysqldump --no-tablespaces -h %s -u %s -p\'%s\' %s > %s', $host, $username, $password, $database, $path . $file);

        if (!is_dir($path)) {
            mkdir($path, 0755, true);
        }

        exec($command);
    }
}
