@php
$heading = CardHelper::getContentById('heading', $card);
$icon = CardHelper::getContentById('icon', $card);
$text = CardHelper::getContentById('text', $card);
$link = CardHelper::getContentById('link', $card);
@endphp

<div class="service-list__item service">
    <a class="service__link" href="{{ $link }}">
        <img class="service__icon shadow" src="storage/upload/{{ $icon->source }}" alt="" width="65" height="65">

        <div class="service__body shadow-sm">
            <h2 class="service__heading">{{ $heading }}</h2>

            <p class="service__text">{{ $text }}</p>
        </div>
    </a>
</div>
