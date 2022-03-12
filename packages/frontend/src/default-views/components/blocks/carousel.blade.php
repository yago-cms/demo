@php
$id = 'bs-' . Str::uuid();
@endphp

<div id="{{ $id }}" class="carousel slide"
    data-bs-interval="{{ $content->autoplay ? $content->interval : 'false' }}"
    data-bs-ride="{{ isset($content->autoplayMode) ? $content->autoplayMode : 'ride' }}">
    @if ($content->indicators)
        <x-blocks.carousel.indicators :id="$id" :content="$content" />
    @endif

    <x-blocks.carousel.slide :id="$id" :content="$content" />

    @if ($content->controls)
        <x-blocks.carousel.controls :id="$id" :content="$content" />
    @endif
</div>
