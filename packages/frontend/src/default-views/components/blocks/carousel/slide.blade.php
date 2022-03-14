@props(['id', 'content'])

<div class="carousel-inner">
    @foreach ($content->slides as $key => $slide)
        <div class="carousel-item{{ $key == 0 ? ' active' : '' }}">
            <x-core.picture :media="$slide->media" :breakpointGroup="$content->breakpoint" />

            @if ($content->captions)
                <div class="carousel-caption">
                    <div class="carousel-content">
                        <h5>{{ $slide->caption }}</h5>

                        @if ($slide->subCaption)
                            <p>{{ $slide->subCaption }}</p>
                        @endif
                    </div>
                </div>
            @endif
        </div>
    @endforeach
</div>
