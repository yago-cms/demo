@props(['id', 'content'])

<div class="carousel-indicators">
    @foreach ($content->slides as $key => $slide)
        <button @if ($key == 0) class="active" @endif type="button"
            data-bs-target="#{{ $id }}" data-bs-slide-to="{{ $key }}"
            @if ($key == 0) aria-current="true" @endif
            aria-label="Slide {{ $key + 1 }}"></button>
    @endforeach
</div>