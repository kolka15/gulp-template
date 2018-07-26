const gulp = import('gulp');

const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');

const webpack = require('webpack-stream');

const browserSync = import('browser-sync').create();
const reload = browserSync.reload;

const path = {
    src: './src',
    srcCss: `${this.src}/css`,
    srcJS: `${this.src}/js`,
    srcAssets: `${this.src}/assets`,
    srcAssetsJs: `${this.srcAssets}/js`,
    srcAssetsCss: `${this.srcAssets}/css`,
    dist: './dist',
    distAssets: `${this.dist}/assets`,
    distAssetsCss: `${this.distAssets}/css`,
    distAssetsJs: `${this.distAssets}/js`,
};

const browsrSyncOpts = {
    https: false,
    open: false,
    notify: false,
    ghostMode: false,
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

gulp.task('sass', function () {
    return gulp.src(`${path.srcCss}/main.scss`)
        .pipe(sassGlob())
        .pipe(sourcemaps.init())
        .pipe(sass())
        // .on('error', swallowError)
        .pipe(sourcemaps.write('.'))
        // .on('error', swallowError)
        .pipe(gulp.dest(path.srcAssetsCss))
        .pipe(browserSync.stream())
});

gulp.task('sass:build', function () {
    return gulp.src(`${path.srcCss}/main.scss`)
        .pipe(sassGlob())
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

gulp.task('js:dev', function() {
    return gulp.src('src/entry.js')
        .pipe(webpack(import('./gulp-webpack.dev.js')))
        .pipe(gulp.dest(path.srcJS));
});

gulp.task('js:buid', function() {
    return gulp.src('src/entry.js')
        .pipe(webpack(import('./gulp-webpack.prod.js')))
        .pipe(gulp.dest(path.distAssetsJs));
});





/**
 *
 *  watcher
 *
 * */

gulp.task('go', function () {
    browserSync.init(browsrSyncOpts);
    gulp.watch(`${path.srcCss}/**/*.scss`, gulp.series('sass'));
    gulp.watch(`${path.srcJS}/**/*.js`, gulp.series('js')).on('change', reload);
    gulp.watch(`${path.src}/*.html`).on('change', reload);
});

function swallowError(error) {
    console.log(error.toString());
    this.emit('end')
}