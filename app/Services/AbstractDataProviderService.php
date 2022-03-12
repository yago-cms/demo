<?php

namespace App\Services;

abstract class AbstractDataProviderService
{
    public function provide(array $pageBlock)
    {
        $blockType = explode('-', $pageBlock['type'])[1];

        if (method_exists(get_called_class(), $blockType)) {
            return $this->{$blockType}($pageBlock);
        }

        return collect();
    }
}
