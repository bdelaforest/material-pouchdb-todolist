'use strict';

var gulp        = require('gulp'),
    gconcat     = require('gulp-concat'),
    grename     = require('gulp-rename'),
    guglify     = require('gulp-uglify'),
    gclean      = require('gulp-clean'),
    gngannot    = require('gulp-ng-annotate'),
    gless       = require('gulp-less'),
    gminifyCSS  = require('gulp-minify-css'),
    // gclosure    = require('gulp-jsclosure'),
    glivereload = require('gulp-livereload'),
    ghtml2js    = require('gulp-ng-html2js'),
    karma       = require('gulp-karma');


var cfg = {
    src: {
        assets: 'src/assets/svg',
        index: 'src/index.html',
        templates: 'src/app/**/*.tpl.html'
        scripts: ['src/app/**/*.js'],
        less: 'src/assets/less/app.less',
        vendors: [
            'src/app/vendor/angular/angular.js',
            'src/app/vendor/angular-sanitize/angular-sanitize.min.js',
            'src/app/vendor/angular-animate/angular-animate.min.js',
            'src/app/vendor/angular-aria/angular-aria.min.js',
            'src/app/vendor/angular-material/angular-material.min.js',
            'src/app/vendor/angular-indexed-db/angular-indexed-db.js',
            'src/app/vendor/pouchdb/dist/pouchdb.min.js',
            'src/app/vendor/lodash/lodash.min.js',
        ],
    },
    dist: {
        dir:  'dist',
        index:   'index.html.css',
        js:      'app.min.js',
        css:     'app.min.css',
        vendors: 'vendors.min.js',
    }
};




/**
 * Cleaning stuff
 */
gulp.task('clean', function() {
    return gulp.src(cfg.dist.dir+'**/*', {read: false})
        .pipe(gclean());
});

/**
 * Build style
 */
gulp.task('build-css', ['clean'], function() {
    return gulp.src(cfg.src.less)
        .pipe(gless()).on('error', errorHandler)
        .pipe(gminifyCSS())
        .pipe(grename(cfg.dist.css))
        .pipe(gulp.dest(cfg.dist.dir));
});


/**
 * Build scripts
 */
gulp.task('build-js', ['clean'], function() {
    return gulp.src(cfg.src.js)
        .pipe(gjshint())
        .pipe(gjshint.reporter())
        .pipe(guglify({mangle: false}))
        .pipe(grename(cfg.dist.js))
        .pipe(gulp.dest(cfg.dist.dir));
});


/**
 * Build scripts
 */
gulp.task('build-vendors', ['clean'], function() {
    return gulp.src(cfg.src.index)
        .pipe(gulp.dest(cfg.dist.dir));
});

// /**
//  * Build scripts
//  */
// gulp.task('copy-index', ['clean'], function() {
//     return gulp.src(cfg.src.vendors)
//         .pipe(guglify({mangle: false}))
//         .pipe(grename(cfg.dist.vendors))
//         .pipe(gulp.dest(cfg.dist.dir));
// });


gulp.task('copy-assets', ['clean'], function() {
    return gulp.src(cfg.src.assets)
        .pipe(gulp.dest(cfg.dist.dir));
});



/**
 * Main task
 */
gulp.task('build', ['clean', 'build-css', 'build-js', 'build-vendors', 'copy-assets'], function() {
    return gulp.src(cfg.src.vendors)
        .pipe(guglify({mangle: false}))
        .pipe(grename(cfg.dist.vendors))
        .pipe(gulp.dest(cfg.dist.dir));
});


// /*
//  * TASKS TO BE CALLED BY USER
//  */
// gulp.task('watch', function() {
//     gulp.watch(cfg.src.lessFiles, ['build']);
//     gulp.watch(cfg.src.index,     ['build']);
//     gulp.watch(cfg.src.pages,     ['build']);
//     gulp.watch(cfg.src.js,        ['build']);
// });
// gulp.task('default', ['build', 'watch']);


gulp.task('default', ['build']);


// Handle the error
function errorHandler (error) {
    console.log(error.toString());
    this.emit('end');
}
