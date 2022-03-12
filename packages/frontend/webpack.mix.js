const mix = require('laravel-mix');

require('laravel-mix-merge-manifest');

mix.js('src/js/app.js', '../../frontend/js/')
    .sass('src/sass/app.scss', '../../frontend/css/')
    .extract()
    .mergeManifest();

mix.setPublicPath('../../public');