'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var modRewrite = require('connect-modrewrite');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var sass = require('gulp-sass');

/*
 Gulp will run a server in the port 8080 with ./app folder on it
 */
gulp.task('connect', function () {
    browserSync.init({
        notify: false,
        port: 8080,                         // localhost:8080
        timestamps: true,                         // localhost:8080
        server: {
            baseDir: './app',               // Main app folder
            middleware: [                   // if HTML5 enabled this is required
                modRewrite([
                    '/assets/(.*) /assets/$1 [L]',
                    '!\\.\\w+$ /index.html [L]'
                ])
            ]
        }
    });
});

/*
 NodeSASS compiler
 */

gulp.task('sass', function () {
    gulp.src([
            './app/assets/sass/style.scss',
            './app/features/**/*.scss'
        ])
        .pipe(concat('style.css'))
        .pipe(sass())
        .pipe(gulp.dest('./app/assets/css'))
        .pipe(browserSync.stream());
});


/*
 In those two tasks we will reload HTML and JSON files when needed
 */
gulp.task('html', function () {
    gulp.src('./app/**/*.html')
        .pipe(browserSync.stream());
});

gulp.task('json', function () {
    gulp.src('./app/**/*.json')
        .pipe(browserSync.stream());
});

/*
 ALERT: This is some Gulp magic!
 -------------------------------
 In this task we are going to compress all the JS files within your angular application.
 We want to be a little dynamic and Gulp allows us to use some regular expressions to find our JS files.

 How to use it:
 *.js - This means that we want every file that ends in .js
 module.*.js - All files that starts with the word module and ends with .js
 ** - We are going to search as deep as we can in order to find the files we want

 Example:
 We want to include all the controllers in our project. To do that we need to use a specific name in those files.
 To make the login controller we need to create the file "controller.login.js"

 In order to find that controller we only need to specify that we are looking for controller.*.js because the name
 of the file meets the regular expression.

 In our folder structure we put the controller inside a folder of a specific feature and then in the main feature.
 For login we end up with the next structure: app/features/auth/login/controller.login.js
 So now if we want to search this controller we can say: ./app/features/ ** /controller.*.js  (without spaces)
 With this url gulp will search in every folder inside features as long as he finds the controller.

 */
gulp.task('js', function () {
    return gulp.src([
            './app/utils.js',
            './app/app.js',
            './app/features/**/module.*.js',
            './app/features/**/service.*.js',
            './app/features/**/controller.*.js'
        ])
        .pipe(concat('app.js'))                     // Name of concat file
        .pipe(gulp.dest('./app/assets/js/'))        // Folder to save the file
        .pipe(browserSync.stream());                  // Force the reload to see the changes
});


/*
 To compress the app.js we will search it and then use the module uglify
 */
gulp.task('js:compress', function () {
    return gulp.src(['./app/assets/js/app.js'])
        .pipe(concat('app.js'))
        .pipe(uglify({
            mangle: false        // Feature to replace original function names with sort ones (not working for now)
        }))
        .pipe(gulp.dest('./app/assets/js/'))
});

/*
 All the watchers we need to reload our page as soon as we save the file
 */
gulp.task('watch', function () {
    gulp.watch(['./app/**/*.html'], ['html']);
    gulp.watch(['./app/**/*.json'], ['json']);
    gulp.watch(['./app/**/*.js', '!./app/assets/**/*.js'], ['js']);
    gulp.watch(['./app/**/*.scss'], ['sass']);
});


/*
 This two functions will compress the bower dependences. In those cases we need to specify the entire path of the files
 because we only want specific files. The order is important because is a hierarchy
 */
gulp.task('vendors:css', function () {
    return gulp.src([
            './bower_components/angular-loading-bar/build/loading-bar.min.css',
            './bower_components/bootstrap/dist/css/bootstrap.min.css'
        ])
        .pipe(concat('vendors.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest('./app/assets/css/'));
});

gulp.task('vendors:js', function () {
    return gulp.src([
            './bower_components/angular/angular.min.js',
            './bower_components/angular-ui-router/release/angular-ui-router.min.js',
            './bower_components/angular-permission/dist/angular-permission.js',
            './bower_components/angular-sanitize/angular-sanitize.min.js',
            './bower_components/angular-loading-bar/build/loading-bar.min.js',
            './bower_components/ngstorage/ngStorage.min.js',
            './bower_components/angular-animate/angular-animate.min.js',
            './bower_components/angular-dynamic-locale/dist/tmhDynamicLocale.min.js',
            './bower_components/i18next/i18next.min.js',
            './bower_components/ng-i18next/dist/ng-i18next.min.js',

            './lib/ui-bootstrap/ui-bootstrap-custom-tpls-0.14.3.min.js'
        ])
        .pipe(concat('vendors.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./app/assets/js/'));
});

/*
 Vendors task will concat and compress all the bower components
 */
gulp.task('vendors', ['vendors:js', 'vendors:css']);

/*
 Main Gulp process to start all development mode. This task will not minify the app.js result in order to make it
 simple to debuggate
 */
gulp.task('start', ['connect', 'watch', 'sass', 'vendors', 'js']);

/*
 Task to minify all js dependences
 */
gulp.task('compile', ['vendors', 'js', 'js:compress']);