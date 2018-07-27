const gulp = require('gulp');

const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');

const webpack = require('webpack-stream');

const fileinclude = require('gulp-file-include');
const del = require('del');

const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

const path = new function () {
    this.src = './src';
    this.srcCss = `${this.src}/css`;
    this.srcJS = `${this.src}/js`;
    this.srcHtml = `${this.src}/html`;
    this.srcAssets = `${this.src}/assets`;
    this.srcAssetsJs = `${this.srcAssets}/js`;
    this.srcAssetsCss = `${this.srcAssets}/css`;
    this.dist = './app';
    this.distAssets = `${this.dist}/assets`;
    this.distAssetsCss = `${this.distAssets}/css`;
    this.distAssetsJs = `${this.distAssets}/js`;
};

const browsrSyncOpts = {
    https: false,
    open: false,
    notify: false,
    ghostMode: false,
    port: 3000,
    server: {
        baseDir: "./src"
    }
};

const cleanCssOpts = {
    compatibility: 'ie9',
    level: 2
};


/**
 *
 *  sass
 *
 * */

const sassGlobOpts = {
    allowEmpty: true

};

gulp.task('sass', function () {
    return gulp.src(`${path.srcCss}/main.scss`)
        .pipe(sassGlob(sassGlobOpts))
        .pipe(sourcemaps.init())
        .pipe(sass())
        // .on('error', swallowError)
        .pipe(sourcemaps.write('.'))
        // .on('error', swallowError)
        .pipe(gulp.dest(path.srcAssetsCss))
        .pipe(browserSync.stream())
});

gulp.task('sass:prod', function () {
    return gulp.src(`${path.srcCss}/main.scss`)
        .pipe(sassGlob(sassGlobOpts))
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 3 versions', 'ie >=9']
        }))
        .pipe(cleanCSS(cleanCssOpts))
        .pipe(gulp.dest(path.distAssetsCss))
});


/**
 *
 *  js
 *
 * */

gulp.task('js:dev', function () {
    return gulp.src(`${path.srcJS}/entrance.js`)
        .pipe(webpack(require('./gulp-webpack.dev.js')))
        .pipe(gulp.dest(path.srcAssetsJs));
});

gulp.task('js:prod', function () {
    return gulp.src(`${path.srcJS}/entrance.js`)
        .pipe(webpack(require('./gulp-webpack.prod.js')))
        .pipe(gulp.dest(path.distAssetsJs));
});


/**
 *
 * html
 *
 * */

gulp.task('fileinclude', function () {
    return gulp.src(`${path.srcHtml}/*.html`)
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(path.src));
});

gulp.task('fileinclude:dist', function () {
    return gulp.src(`${path.srcHtml}/*.html`)
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(path.dist));
});

// gulp.task('html:dist', function () {
//     return gulp.src(`${path.src}/*.html`)
//         .pipe(gulp.dest(path.dist));
// });


/**
 *
 * clean
 *
 * */

gulp.task('clean', function () {
    return del([`${path.dist}/**`, `${path.src}/*.html`]);
});


/**
 *
 *  watcher
 *
 * */

gulp.task('go', function () {
    browserSync.init(browsrSyncOpts);
    gulp.watch(`${path.srcCss}/**/*.scss`, gulp.series('sass'));
    gulp.watch(`${path.srcAssetsJs}/**/*.js`).on('change', reload);
    gulp.watch(`${path.srcHtml}/**/*.html`, gulp.series('fileinclude')).on('change', reload);
});


/**
 *
 *  prod
 *
 * */

gulp.task('build', gulp.series('clean', gulp.parallel(['fileinclude', 'fileinclude:dist', 'sass:prod', 'js:prod'])));


function swallowError(error) {
    console.log(error.toString());
    this.emit('end')
}