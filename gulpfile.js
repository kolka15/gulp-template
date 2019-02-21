const gulp = require('gulp');

const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const pug = require('gulp-pug');

const webpack = require('webpack-stream');

const del = require('del');

const browserSync = require('browser-sync').create();
const reload = browserSync.reload;


const src = './src';
const prod = './app';
const srcJS = `${src}/js`;
const srcCss = `${src}/css`;
const srcImg = `${src}/img`
const srcPug = `${src}/pug`;
const srcAssets = `${src}/assets`;
const prodImg = `${prod}/img`;
const prodAssets = `${prod}/assets`;
const srcAssetsJs = `${srcAssets}/js`;
const srcAssetsCss = `${srcAssets}/css`;
const prodAssetsJs = `${prodAssets}/js`;
const prodAssetsCss = `${prodAssets}/css`;


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
    return gulp.src(`${srcCss}/main.scss`)
        .pipe(sassGlob(sassGlobOpts))
        .pipe(sourcemaps.init())
        .pipe(sass())
        // .on('error', swallowError)
        .pipe(sourcemaps.write('.'))
        // .on('error', swallowError)
        .pipe(gulp.dest(srcAssetsCss))
        .pipe(browserSync.stream())
});

gulp.task('sass:prod', function () {
    return gulp.src(`${srcCss}/main.scss`)
        .pipe(sassGlob(sassGlobOpts))
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 3 versions', 'ie >=9']
        }))
        .pipe(cleanCSS(cleanCssOpts))
        .pipe(gulp.dest(prodAssetsCss))
});


/**
 *
 *  js
 *
 * */

gulp.task('js:dev', function () {
    return gulp.src(`${srcJS}entrance.js`)
        .pipe(webpack(require('./gulp-webpack.dev.js')))
        .pipe(gulp.dest(srcAssetsJs));
});

gulp.task('js:prod', function () {
    return gulp.src(`${srcJS}/entrance.js`)
        .pipe(webpack(require('./gulp-webpack.prod.js')))
        .pipe(gulp.dest(prodAssetsJs));
});


/**
 *
 * html, pug
 *
 * */

const pugOpts = {
    pretty: true
}

gulp.task('pug', function buildHTML() {
    return gulp.src(`${srcPug}/*.pug`)
        .pipe(pug(pugOpts))
        .pipe(gulp.dest(src));
});

gulp.task('pug:prod', function buildHTML() {
    return gulp.src(`${srcPug}/*.pug`)
        .pipe(pug(pugOpts))
        .pipe(gulp.dest(prod));
});


/**
 *
 * clean
 *
 * */

gulp.task('clean', function () {
    return del([`${prod}/**`, `${src}/*.html`]);
});

/**
 *
 * img copy
 *
 * */

gulp.task('img:copy', function () {
    return gulp.src(`${srcJS}entrance.js`)
        .pipe(webpack(require('./gulp-webpack.dev.js')))
        .pipe(gulp.dest(srcAssetsJs));
});


/**
 *
 *  watcher
 *
 * */

gulp.task('go', function () {
    browserSync.init(browsrSyncOpts);
    gulp.watch(`${srcCss}/**/*.scss`, gulp.series('sass'));
    gulp.watch(`${srcAssetsJs}/**/*.js`).on('change', reload);
    gulp.watch(`${srcPug}/**/*.pug`, gulp.series('pug')).on('change', reload);
});


/**
 *
 *  prod
 *
 * */

gulp.task('default', gulp.series('clean', gulp.parallel(['pug', 'pug:prod', 'sass:prod', 'js:prod'])));


function swallowError(error) {
    console.log(error.toString());
    this.emit('end')
}