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

    <section class="awards">
        <div class="container">
            <div class="row">
                <div class="col-md-5">
                    <div class="awards__body">
                        <x-core.page-section :data="$data" page-section-name="Awards" column="0" />
                    </div>
                </div>

                <div class="col-md-6 offset-md-1">
                    <div class="awards__image">
                        <x-core.page-section :data="$data" page-section-name="Awards" column="1" />
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="services">
        <div class="container">
            <div class="services__header">
                <x-core.page-section :data="$data" page-section-name="Services header" column="0" />

                <div class="row">
                    <div class="col-md-9">
                        <x-core.page-section :data="$data" page-section-name="Services header" column="1" />
                    </div>

                    <div class="col-md-3">
                        <x-core.page-section :data="$data" page-section-name="Services header" column="2" />
                    </div>
                </div>
            </div>

            <div class="row row-cols-1 row-cols-md-2 service-list">
                <x-core.page-section :data="$data" page-section-name="Services" />
            </div>
        </div>
    </section>
@endsection
