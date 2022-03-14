@props(['id', 'content'])

<div class="carousel-inner">
    @foreach ($content->slides as $key => $slide)
        <div class="carousel-item{{ $key == 0 ? ' active' : '' }}">
            <x-core.picture :media="$slide->media" :breakpointGroup="$content->breakpoint" />

            @if ($content->captions)
                <div class="carousel-caption d-none d-md-block">
                    <h5>{{ $slide->caption }}</h5>

                    @if ($slide->subCaption)
                        <p>{{ $slide->subCaption }}</p>
                    @endif
                </div>
            @endif
        </div>
    @endforeach
</div>
