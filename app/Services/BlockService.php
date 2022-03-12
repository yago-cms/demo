<?php

namespace App\Services;

class BlockService
{
    private $fallbacks = [];

    public function fallback($type, $method)
    {
        $this->fallbacks[] = [
            'type' => $type,
            'method' => $method,
        ];
    }

    public function getFallbacks()
    {
        return $this->fallbacks;
    }
}
