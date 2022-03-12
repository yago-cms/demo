@props(['media', 'breakpointGroup', 'class' => ''])

@php
$cdn = MediaHelper::getCdn();
$breakpoints = MediaHelper::getBreakpoints($breakpointGroup);
@endphp

<picture class="{{ $class }}">
    @foreach ($breakpoints as $i => $breakpoint)
        @php
            switch ($cdn->type) {
                case 'imgix':
                    $source =
                        rtrim($cdn->source, '/') .
                        '/' .
                        $media .
                        '?' .
                        http_build_query([
                            'w' => $breakpoint->targetWidth,
                            'h' => $breakpoint->targetHeight,
                            'fit' => 'crop',
                        ]);

                    break;

                default:
                    $source = asset("storage/upload/{$media}");
                    break;
            }
        @endphp

        @if ($i == 0)
            <img class="img-fluid d-block" src="{{ $source }}">
        @else
            <source srcset="{{ $source }}" media="(min-width: {{ $breakpoint->minWidth }}px)">
        @endif
    @endforeach
</picture>
