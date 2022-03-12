<?php

namespace App\GraphQL\Queries;

use App\Models\Page;
use App\Models\PageRevision;
use GraphQL\Type\Definition\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

class PagesQuery
{
    public function __invoke(
        $rootValue,
        array $args,
        GraphQLContext $context,
        ResolveInfo $resolveInfo
    ) {
        $pages = Page::orderBy('sorting')->get();

        // TODO: optimize this...
        foreach ($pages as &$page) {
            $pageRevision = PageRevision::where('page_id', $page->id)
                ->where('is_saved', true)
                ->orderBy('id', 'desc')
                ->first();

            if ($pageRevision) {
                $page['name'] = $pageRevision['name'];
            }
        }
        unset($page);

        return $pages;
    }
}
