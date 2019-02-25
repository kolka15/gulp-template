const gulp = require('gulp');

const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const pug = require('gulp-pug');
const imagemin = require('gulp-imagemin');
const spritesmith = require('gulp.spritesmith');
const svgSprite = require('gulp-svg-sprite');
const cheerio = require('gulp-cheerio');
const replace = require('gulp-replace');

const webpack = require('webpack-stream');

const del = require('del');

const browserSync = require('browser-sync').create();
const reload = browserSync.reload;


const src = './src';
const prod = './app';
const srcJS = `${src}/js`;
const srcCss = `${src}/css`;
const srcImg = `${src}/img`
const srcImgVector = `${srcImg}/vector`
const srcImgRaster = `${srcImg}/raster`
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
 * images
 *
 * */

gulp.task('img-min', function () {
    return gulp.src([(`${srcImg}/**/*`), (`!${srcImg}/vector/**/*sprite*.svg`)])
        .pipe(imagemin())
        .pipe(gulp.dest(`${srcImg}`))
});

gulp.task('img:copy', function () {
    return gulp.src(`${srcJS}entrance.js`)
        .pipe(webpack(require('./gulp-webpack.dev.js')))
        .pipe(gulp.dest(srcAssetsJs));
});

gulp.task('sprite', function () {
    return gulp.src(`${srcImg}/raster/sprite-smith/*.png`).pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: './../../css/_global/_sprite.scss',
        padding: 20,
        imgPath: '/img/rastr/sprite.png',
        algorithm: 'binary-tree',

        retinaImgName: 'sprite2x.png',
        retinaSrcFilter: './img/raster/sprite-smith/*@2x.png',
        retinaImgPath: '/img/rastr/sprite2x.png'
    }))
        .pipe(gulp.dest(`${srcImg}`));
});


/**
 *
 * vector
 *
 * */

gulp.task('svg-sprite:symbol', function () {
    return gulp.src(`${srcImgVector}/symbol/**/*.svg`, {cwd: ""})
        .pipe(svgSprite({
            dest: '.',
            mode: {
                symbol: {
                    prefix: '.svg-',
                    sprite: '../sprite-symbol.svg',
                    example: true,
                    bust: false,
                    render: {
                        scss: {
                            dest: './../../../css/_global/_sprite-symbol.scss'
                        }
                    }

                }
            }
        }))
        .on('error', swallowError)
        .pipe(gulp.dest(srcImgVector));
});

gulp.task('svg-sprite:css', function () {
    return gulp.src(`${srcImgVector}/css-sprite/**/*.svg`, {cwd: ""})
        .pipe(svgSprite({
            dest: '.',
            shape: {
                spacing: {         // Add padding
                    padding: 1
                }
            },
            mode: {
                css: {
                    prefix: '.svg-',
                    sprite: '../sprite-css.svg',
                    example: true,
                    bust: false,
                    render: {
                        scss: {
                            dest: './../../../css/_global/_sprite-css.scss'
                        }
                    }
                }
            }
        }))
        .on('error', swallowError)
        .pipe(gulp.dest(srcImgVector));
});

gulp.task('copy:svg-symbol-template', function () {
    return gulp.src([`${srcImgVector}/symbol/sprite.symbol.html`, `${srcImgVector}/css/sprite.css.html`])
        .on('error', swallowError)
        .pipe(gulp.dest(srcImgVector));
});

gulp.task('del:svg-symbol-template', function () {
    return del([(`${srcImgVector}/symbol/sprite.symbol.html`),
        (`${srcImgVector}/css/`)]);
});

gulp.task('symbol:remove-attrs', function () {
    return gulp.src(`${srcImgVector}/sprite-symbol.svg`)
        .pipe(cheerio({
            run: function ($) {
                $('[fill]').removeAttr('fill');
                $('[style]').removeAttr('style');
                $('[class]').removeAttr('class');
                $('style').remove();
            },
            parserOptions: {xmlMode: true}
        }))
        .pipe(gulp.dest(srcImgVector));
});

gulp.task('change-path-to-svg', function () {
    return gulp.src([`${srcImgVector}/sprite.symbol.html`, `${srcCss}/_global/_sprite-css.scss`])
        .pipe(replace('../', '/img/vector/'))
        .pipe(gulp.dest(function (file) {
            return file.extname === '.html' ? `${srcImgVector}` :
                file.extname === '.scss' ? `${srcCss}/_global/` : '';
        }));
});

gulp.task('change-rel-path-to-svg', function () {
    return gulp.src([`${srcImgVector}/sprite.css.html`])
        .pipe(replace('../sprite-css.svg', './sprite-css.svg'))
        .pipe(gulp.dest(srcImgVector))
});

gulp.task('svg',
    gulp.series(
        'svg-sprite:symbol',
        'svg-sprite:css',
        'copy:svg-symbol-template',
        'del:svg-symbol-template',
        gulp.parallel('symbol:remove-attrs', 'change-path-to-svg', 'change-rel-path-to-svg')
    )
);


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