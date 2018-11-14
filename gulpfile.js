const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const webpackConfig = require('./webpack.config.js');
const webpackStream = require('webpack-stream');
const sourcemaps = require('gulp-sourcemaps');
const runSequence = require('run-sequence');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const webpack = require('webpack');
const scss = require('gulp-sass');
const pug = require('gulp-pug');
const gulp = require('gulp');
const del = require('del');
const sprite = require('gulp.spritesmith');
const responsive = require('gulp-responsive');
const imagemin = require('gulp-imagemin');

let isDev = true;
let isTunnel = false;

const paths = {
    watch: {
        pug: ['./source/components/**/*.pug', './source/pages/**/*.pug'],
        scss: ['./source/components/**/*.scss', './source/pages/**/*.scss'],
        js: './source/javascript/**/*.js',
        images: './source/static/images/general/**/*.*',
        sprite: {
            bitmap: './source/static/sprite/bitmap/**/*.*',
            svg: './source/static/sprite/svg/**/*.*',
        },
        fonts: './source/static/fonts/**/*.*'
    },
    source: {
        pug: ['./source/pages/*.pug'],
        scss: ['./source/pages/*.scss'],
        js: './source/javascript/*.js',
        images: './source/static/images/general/**/*.*',
        fonts: './source/static/fonts/**/*.*',
        sprite: {
            bitmap: './source/static/images/sprites/bitmap/**/*.*',
            svg: './source/static/images/sprites/svg/**/*.svg'
        }
    },
    dest: {
        baseDir: './public/',
        html: './public/',
        css: './public/css/',
        js: './public/js/',
        images: './public/images/',
        fonts: './public/fonts/',
        sprite: {
            images: './public/css',
            scss: './source/pages/libs/'
        }
    }
};

/* *************** Server *************** */
gulp.task('server', () => {
    browserSync.init({
        tunnel: isTunnel,
        server: {
            baseDir: paths.dest.baseDir
        }
    });
    gulp.watch(paths.watch.pug, ['pug']);
    gulp.watch(paths.watch.scss, ['scss']);
    gulp.watch(paths.watch.js, ['js']);
    gulp.watch(paths.watch.sprite.bitmap, ['sprite']);
    gulp.watch(paths.watch.images, ['copy:images']);
    gulp.watch(paths.watch.fonts, ['copy:fonts']);
});

/* *************** Sass compiler *************** */
gulp.task('scss', () => {
    return gulp
        .src(paths.source.scss)
        .pipe(plumber({
            errorHandler: notify.onError(err => {
                return {
                    title: 'Style',
                    message: err.message
                }
            })
        }))
        .pipe(sourcemaps.init())
        .pipe(scss({
            outputStyle: isDev ? '' : 'compressed'
        }))
        .pipe(autoprefixer({
            browsers: ['last 6 versions'],
            cascade: false
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.dest.css))
        .pipe(browserSync.stream());
});

/* *************** Pug compiler *************** */
gulp.task('pug', () => {
    return gulp
        .src(paths.source.pug)
        .pipe(plumber({
            errorHandler: notify.onError(err => {
                return {
                    title: 'Pug',
                    message: err.message
                }
            })
        }))
        .pipe(pug({
            pretty: isDev
        }))
        .pipe(gulp.dest(paths.dest.html))
        .pipe(browserSync.stream())
});

/* *************** JavaScript compiler *************** */
gulp.task('js', () => {
    return gulp
        .src(paths.source.js)
        .pipe(plumber({
            errorHandler: notify.onError(err => {
                return {
                    title: 'js',
                    message: err.message
                }
            })
        }))
        .pipe(webpackStream(webpackConfig, webpack))
        .pipe(gulp.dest(paths.dest.js))
        .pipe(browserSync.stream());
});

/* ************** Sprites **************** */
gulp.task('sprite', callback => {
    const spriteData = gulp.src(paths.source.sprite.bitmap)
        .pipe(sprite({
            imgName: 'sprite.png',
            cssName: 'sprite.scss'
        }));
    spriteData.img.pipe(gulp.dest(paths.dest.sprite.images));
    spriteData.css.pipe(gulp.dest(paths.dest.sprite.scss));
    callback();
});

/* *************** Copy images *************** */
gulp.task('copy:images', () => {
    return gulp
        .src(paths.source.images)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.dest.images))
        .pipe(browserSync.stream());
});

/* *************** Copy fonts *************** */
gulp.task('copy:fonts', () => {
    return gulp
        .src(paths.source.fonts)
        .pipe(gulp.dest(paths.dest.fonts))
        .pipe(browserSync.stream());
});

/* *************** Clear public folder *************** */
gulp.task('clean:public', () => del(`./${paths.dest.baseDir}`));

/* *************** Default task for dev mode *************** */
gulp.task('default', callback => {
    let arr = process.argv;
    let length = arr.length;

    if (length > 2) {
        for (let i = 2; i < length; i++) {
            isTunnel = arr[i] == '--tunnel';
        }
    }

    runSequence(
        'clean:public',
        'sprite',
        ['scss', 'pug', 'js'],
        ['copy:images', 'copy:fonts'],
        'server',
        callback
    );
});

/* *************** Production mode *************** */
gulp.task('prod', callback => {
    isDev = false;
    gulp.start('default');
});