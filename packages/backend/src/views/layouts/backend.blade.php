<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css?family=Cabin:400,500,700|Roboto+Condensed:700" rel="stylesheet">

    <link href="{{ mix('backend/css/app.css') }}" rel="stylesheet">

    <title>@yield('title')</title>
</head>
<body class="body">
    <div id="app"></div>

    <script src="{{ mix('backend/js/manifest.js') }}"></script>
    <script src="{{ mix('backend/js/vendor.js') }}"></script>
    <script src="{{ mix('backend/js/app.js') }}"></script>

    @stack('scripts')
</body>
</html>