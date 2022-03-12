<?php

namespace App\View\Components\Core;

use Illuminate\View\Component;

class Field extends Component
{
    public $fields;

    public $fieldKey;

    public $column;

    /**
     * Create a new component instance.
     *
     * @return void
     */
    public function __construct($fields, $fieldKey, $column = null)
    {
        $this->fields = $fields;
        $this->fieldKey = $fieldKey;
        $this->column = $column;
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\Contracts\View\View|\Closure|string
     */
    public function render()
    {
        $blocks = [];

        foreach ($this->fields as $field) {
            if ($field['key'] == $this->fieldKey) {
                $blocks = $field['fieldBlocks'];
                break;
            }
        }

        return view('components.core.block-list', compact('blocks'));
    }
}
