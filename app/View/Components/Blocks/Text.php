<?php

namespace App\View\Components\Blocks;

use App\Contracts\Block;
use Illuminate\View\Component;

class Text extends Component
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
        $content = $this->block['content'];

        return view('components.blocks.text', compact('content'));
    }
}
