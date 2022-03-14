@extends('layouts.frontend')

@section('content')
    <x-core.flash-message />

    <section class="hero">
        <div class="hero__carousel">
            <x-core.page-section :data="$data" page-section-name="Hero" column="0" />
        </div>

        <div class="hero__overlay">
            <x-core.page-section :data="$data" page-section-name="Hero" column="1" />
        </div>
    </section>

    <section class="main">
        <div class="container">
            <x-core.page-section :data="$data" page-section-name="Main" />
        </div>
    </section>
@endsection
