@php
$id = 'bs-accordion-' . Str::uuid();
@endphp

@if ($content->type == 'card')
    <div class="accordion" id="{{ $id }}">
        @foreach ($cards as $i => $card)
            @php
                $headingId = 'bs-heading-' . Str::uuid();
                $collapseId = 'bs-collapse-' . Str::uuid();
            @endphp

            <div class="accordion-item">
                <div class="accordion-header" id="{{ $headingId }}">
                    <button class="accordion-button{{ $i == 0 && $content->firstOpen ? '' : ' collapsed' }}"
                        type="button" data-bs-toggle="collapse" data-bs-target="#{{ $collapseId }}"
                        aria-controls="{{ $collapseId }}"
                        @if ($i == 0 && $content->firstOpen) aria-expanded="true" @endif>
                        {{ $card['label'] }}
                    </button>
                </div>

                <div id="{{ $collapseId }}"
                    class="accordion-collapse collapse{{ $i == 0 && $content->firstOpen ? ' show' : '' }}"
                    aria-labelledby="{{ $headingId }}"
                    @if (!$content->alwaysOpen) data-bs-parent="#{{ $id }}" @endif>
                    <div class="accordion-body">
                        <x-dynamic-component :component="$component" :card="$card" />
                    </div>
                </div>
            </div>
        @endforeach
    </div>
@elseif ($content->type == 'text')
    <div class="accordion" id="{{ $id }}">
        @foreach ($content->texts as $i => $text)
            @php
                $headingId = 'bs-heading-' . Str::uuid();
                $collapseId = 'bs-collapse-' . Str::uuid();
            @endphp

            <div class="accordion-item">
                <div class="accordion-header" id="{{ $headingId }}">
                    <button class="accordion-button{{ $i == 0 && $content->firstOpen ? '' : ' collapsed' }}"
                        type="button" data-bs-toggle="collapse" data-bs-target="#{{ $collapseId }}"
                        aria-controls="{{ $collapseId }}"
                        @if ($i == 0 && $content->firstOpen) aria-expanded="true" @endif>
                        {{ $text->label }}
                    </button>
                </div>

                <div id="{{ $collapseId }}"
                    class="accordion-collapse collapse{{ $i == 0 && $content->firstOpen ? ' show' : '' }}"
                    aria-labelledby="{{ $headingId }}"
                    @if (!$content->alwaysOpen) data-bs-parent="#{{ $id }}" @endif>
                    <div class="accordion-body">
                        @if (isset($text->text))
                            {!! $text->text !!}
                        @endif
                    </div>
                </div>
            </div>
        @endforeach
    </div>
@endif
