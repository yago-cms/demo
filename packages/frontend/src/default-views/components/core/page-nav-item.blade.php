<li class="nav-item">
    <a class="nav-link" href="/{{ $page->route }}">{{ $page->name }}</a>

    @if (count($page->descendants) > 0 && ($level < $depth || $depth == -1))
        <ul>
            @foreach ($page->descendants as $page)
                <x-core.page-nav-item :page="$page" :level="++$level" :depth="$depth" />
            @endforeach
        </ul>
    @endif
</li>
