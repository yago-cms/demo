<?php

namespace Database\Seeders;

use App\Models\Page;
use App\Models\PageTemplate;
use App\Models\PageTemplateSection;
use App\Models\PageTemplateSectionColumn;
use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\PermissionRegistrar;

class TestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Auth
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $user = User::factory()->create([
            'name' => 'John Doe',
            'email' => 'john@doe.se',
            'password' => bcrypt('johndoe'),
        ]);
        $user->assignRole('writer', 'superadmin');

        // Page templates
        PageTemplate::factory()->create([
            'name' => 'Start',
            'sorting' => 0,
        ]);

        PageTemplateSection::factory()->create([
            'page_template_id' => 1,
            'name' => 'Hero',
            'key' => 'hero',
            'sorting' => 0,
        ]);

        PageTemplateSection::factory()->create([
            'page_template_id' => 1,
            'name' => 'Main',
            'key' => 'main',
            'sorting' => 1,
        ]);

        PageTemplateSectionColumn::factory()->create([
            'page_template_section_id' => 1,
        ]);

        PageTemplateSectionColumn::factory()->create([
            'page_template_section_id' => 1,
        ]);

        PageTemplateSectionColumn::factory()->create([
            'page_template_section_id' => 2,
        ]);

        // Pages
        Page::factory()->create([
            'page_template_id' => 1,
            'name' => 'Start',
            'slug' => 'start',
            'route' => 'start',
            'is_root' => 1,
            'is_published' => 1,
            'is_shown_in_menu' => 1,
            'sorting' => 0,
        ]);
    }
}
