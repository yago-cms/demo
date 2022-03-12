<?php

namespace App\Helpers;

use App\Models\Page;

class ModuleHelper
{
    public static function getPageRoute($pageId)
    {
        $page = Page::find($pageId);

        return $page->route;
    }
}
