@extends('layouts.frontend')

@section('content')
    <x-core.flash-message />

    <section class="hero">
        <div class="container">
            <div class="row">
                <div class="col">
                    <x-core.page-section :data="$data" page-section-name="Hero" column="0" />
                </div>

                <div class="col logo">
                    <x-core.page-section :data="$data" page-section-name="Hero" column="1" />
                </div>
            </div>
        </div>
    </section>

    <section class="features">
        <x-core.page-section :data="$data" page-section-name="Features" />
    </section>
@endsection
