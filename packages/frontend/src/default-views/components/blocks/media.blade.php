@foreach ($medias as $media)
    <x-core.picture :media="$media->source" :breakpointGroup="$content->breakpoint" />
@endforeach
