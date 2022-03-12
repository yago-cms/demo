<?php

namespace App\Http\Controllers;

use App\Models\CardTemplate;
use App\Models\Field;
use App\Models\Page;
use App\Models\PageRevision;
use App\Models\Settings;
use App\Services\AbstractDataProviderService;
use App\Services\BlockService;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\View;

class FrontendController extends Controller
{
    public function index()
    {
        return $this->getPage();
    }

    public function getPage($route = '')
    {
        $this->checkPaths();

        if ($route == '') {
            $page = Page::where('is_root', true)->where('is_published', 1);
        } else {
            $page = Page::where('route', $route)->where('is_published', 1);
        }

        $page = $page->first();

        if (!$page) {
            $segments = Str::of($route)->explode('/');

            // try with last segment removed
            $lastSegment = $segments->pop();

            $page = Page::where('route', $segments->join('/'))->where('is_published', 1)
                ->first();

            if (!$page) {
                abort(404);
            }

            // the last segment maybe resolves to a stored object
            $blockService = app(BlockService::class);
            $fallbacks = $blockService->getFallbacks();

            // check page blocks for registered modules
            foreach ($page->pageBlocks as $pageBlock) {
                foreach ($fallbacks as $fallback) {
                    if ($pageBlock->type == $fallback['type']) {
                        $controller = $fallback['method'][0];
                        $action = $fallback['method'][1];

                        $response = app()->call("{$controller}@{$action}", ['segment' => $lastSegment]);

                        return $this->prepareView($response);
                    }
                }
            }
        }

        return $this->renderPage($page);
    }

    public function getPageRevision($pageRevisionId)
    {
        $pageRevision = PageRevision::where('id', $pageRevisionId)->firstOrFail();

        return $this->renderPage($pageRevision, true);
    }

    private function prepareView(\Illuminate\View\View $view)
    {
        // attach menu
        $query = Page::query();
        $pages = $query
            ->where('is_published', 1)
            ->where('is_shown_in_menu', 1)
            ->where('parent_page_id', 0)
            ->with('descendants')
            ->get();

        return $view->with(compact('pages'));
    }

    private function renderPage($page, $isRevision = false)
    {
        $pageTemplate = $page->pageTemplate;

        if (!$pageTemplate) {
            abort(500, 'Page has no template');
        }

        $pageTemplateSlug = Str::slug($pageTemplate->name);
        $viewTemplate = "templates.{$pageTemplateSlug}";

        $view = view($viewTemplate);
        $view->getFactory()->startSection('title', $page->name);

        // page sections
        $pageSections = $page->pageSections();

        foreach ($pageSections as &$pageSection) {
            foreach ($pageSection['pageBlocks'] as &$pageBlock) {
                $module = Str::ucfirst(explode('-', $pageBlock['type'])[0]);
                $className = "Yago\\{$module}\\Services\\DataProviderService";

                if (class_exists($className)) {
                    $dataProviderService = new $className;

                    if ($dataProviderService instanceof AbstractDataProviderService) {
                        $pageBlock['data'] = $dataProviderService->provide($pageBlock);
                    }
                }
            }
            unset($pageBlock);
        }
        unset($pageSection);

        // config
        config(['page.currentPageId' => $page->id]);

        // settings
        $settings = Settings::all();

        foreach ($settings as $item) {
            config(["settings.{$item->id}" => $item->value]);
        }

        // card templates
        $cardTemplates = CardTemplate::all();

        foreach ($cardTemplates as $cardTemplate) {
            config(["cardTemplates.{$cardTemplate->id}" => collect($cardTemplate)]);
        }

        // fields
        $fields = Field::all();

        $data = compact('pageSections', 'fields');

        return $this->prepareView($view->with(compact('page', 'data', 'isRevision')));
    }

    private function checkPaths()
    {
        // Check if any template is installed
        if (!View::exists('layouts.frontend')) {
            abort(500, 'No template installed.');
        }
    }
}
