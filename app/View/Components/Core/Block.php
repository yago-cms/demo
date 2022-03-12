<?php

namespace App\View\Components\Core;

use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\View;
use Illuminate\View\Component;

class Block extends Component
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
        $component = "yago-{$this->block['type']}";

        $componentAliases = Blade::getClassComponentAliases();

        if (!isset($componentAliases[$component])) {
            $component = str_replace('yago-', 'blocks.', $component);

            if (!View::exists('components.' . $component)) {
                return;
            }
        }

        return view('components.core.block', [
            'component' => $component,
            'block' => $this->block,
        ]);
    }
}
