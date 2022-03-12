<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;

class BackendController extends Controller
{
    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        return view('layouts.backend');
    }
}
