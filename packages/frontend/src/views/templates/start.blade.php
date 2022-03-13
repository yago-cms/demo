@extends('layouts.frontend')

@section('content')
    <x-core.flash-message />

    <section class="hero">
        <x-core.page-section :data="$data" page-section-name="Hero" column="0" />

        <x-core.page-section :data="$data" page-section-name="Hero" column="1" />
    </section>

    <section class="awards">
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <x-core.page-section :data="$data" page-section-name="Awards" column="0" />
                </div>

                <div class="col-md-6">
                    <x-core.page-section :data="$data" page-section-name="Awards" column="1" />
                </div>
            </div>
        </div>
    </section>

    <section class="services">
        <div class="container">
            <x-core.page-section :data="$data" page-section-name="Services" column="0" />

            <div class="row row-cols-1 row-cols-md-2 service-list">
                <x-core.page-section :data="$data" page-section-name="Services" column="1" />
            </div>
        </div>
    </section>
@endsection
