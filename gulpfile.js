'use strict';

var gulp        = require('gulp'),
    gconcat     = require('gulp-concat'),
    grename     = require('gulp-rename'),
    guglify     = require('gulp-uglify'),
    gclean      = require('gulp-clean'),
    gtemplate   = require('gulp-template'),
    // gngannot    = require('gulp-ng-annotate'),
    gless       = require('gulp-less'),
    gminifyCSS  = require('gulp-minify-css'),
    glivereload = require('gulp-livereload'),
    ghtml2js    = require('gulp-ng-html2js');
    // karma       = require('gulp-karma');


var cfg = {
    src: {
        icons: 'src/assets/svg/**/*',
        index: 'src/index.html',
        templates: 'src/app/**/*.tpl.html',
        scripts: ['src/app/**/*.js'],
        less: 'src/assets/less/app.less',
        vendors: [
            'src/vendor/angular/angular.js',
            'src/vendor/angular-sanitize/angular-sanitize.js',
            'src/vendor/angular-animate/angular-animate.js',
            'src/vendor/angular-aria/angular-aria.js',
            'src/vendor/angular-material/angular-material.js',
            'src/vendor/pouchdb/dist/pouchdb.js',
            'src/vendor/lodash/lodash.js',
            'src/vendor/angular-material-icons/angular-material-icons.js',
            'src/vendor/svg-morpheus/compile/unminified/svg-morpheus.js',
        ],
        manifest: 'src/manifest.tpl.appcache',
    },
    dist: {
        dir:  'dist',
        icons:   'assets/svg',
        index:   'index.html.css',
        js:      'app/app.min.js',
        // tpl:     'app/templates.min.js',
        css:     'app/app.min.css',
        vendors: 'app/vendors.min.js',
        manifest: 'manifest.appcache',
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
    return gulp.src(cfg.src.scripts)
        .pipe(guglify({mangle: false}))
        .pipe(gconcat(cfg.dist.js))
        .pipe(gulp.dest(cfg.dist.dir));
});


/**
 * Build scripts
 */
gulp.task('build-vendors', ['clean'], function() {
    return gulp.src(cfg.src.vendors)
        .pipe(guglify({mangle: false}))
        .pipe(gconcat(cfg.dist.vendors))
        .pipe(gulp.dest(cfg.dist.dir));
});

gulp.task('copy-templates', ['clean'], function() {
    return gulp.src(cfg.src.templates)
        // .pipe(ghtml2js({moduleName: 'app'}))
        // .pipe(gconcat(cfg.dist.tpl))
        .pipe(gulp.dest(cfg.dist.dir+'/app'));
});

gulp.task('copy-icons', ['clean'], function() {
    return gulp.src(cfg.src.icons)
        .pipe(gulp.dest(cfg.dist.dir+'/'+cfg.dist.icons));
});

gulp.task('copy-manifest', ['clean'], function() {
    return gulp.src(cfg.src.manifest)
        .pipe(gtemplate({manifestTimestamp: new Date().toISOString()}))
        .pipe(gconcat(cfg.dist.manifest))
        .pipe(gulp.dest(cfg.dist.dir));
});


/**
 * Main task
 */
gulp.task('build', [
        'clean', 'build-css', 'build-js', 'build-vendors',
        'copy-templates', 'copy-icons', 'copy-manifest'], function() {
    return gulp.src(cfg.src.index)
        .pipe(gulp.dest(cfg.dist.dir));
});



gulp.task('watch-build', ['build'], function() {
    // glivereload.changed('Source changed');
});


/*
 * TASKS TO BE CALLED BY USER
 */
gulp.task('default', ['build']);
gulp.task('watch',   ['build'], function() {
    // glivereload.listen();
    gulp.watch([
            'src/**/*.html',
            cfg.src.scripts,
            'src/**/*.less',
        ],
        ['watch-build']);
});


// Handle the error
function errorHandler (error) {
    console.log(error.toString());
    this.emit('end');
}
