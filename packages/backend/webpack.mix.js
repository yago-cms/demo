const mix = require('laravel-mix');

require('laravel-mix-merge-manifest');

mix.js('src/js/app.js', '../../backend/js/')
    .react()
    .sass('src/sass/app.scss', '../../backend/css/')
    .extract()
    .mergeManifest();

mix.copy('../../node_modules/tinymce/', '../../public/backend/js/tinymce/');

mix.setPublicPath('../../public');
