<?php

namespace App\View\Components\Blocks;

use Illuminate\View\Component;

class Media extends Component
{
    public $block;

    /**
     * Create a new component instance.
     *
     * @return void
     */
    public function __construct($block)
    {
        $this->block = $block;
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\Contracts\View\View|\Closure|string
     */
    public function render()
    {
        $content = json_decode($this->block['content']);

        if (!$content) {
            return null;
        }

        $medias = [];

        if (isset($content->medias)) {
            $medias = $content->medias;
        }

        return view('components.blocks.media', compact('content', 'medias'));
    }
}
