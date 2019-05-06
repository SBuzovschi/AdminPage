const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require ('gulp-autoprefixer');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();

const scssFiles = './src/scss/*.scss';
const cssFiles = './src/scss/css/*.css';
const jsFiles = './src/js/*.js';
const index = './src/*html';


function css(){
    return gulp.src(scssFiles)
        .pipe(sass())
        .pipe(gulp.dest('./src/scss/css'))
}


function transformMoveCSS() {
    return gulp.src(cssFiles)
        .pipe(concat('style.css'))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cleanCSS({level: 2}))
        .pipe(gulp.dest('./build/css'))
        .pipe(browserSync.stream());
}

function script() {
    return gulp.src(jsFiles)
        .pipe(concat('script.js'))
        .pipe(uglify({
            toplevel:true
        }))
        .pipe(gulp.dest('/build/js'))
        .pipe(browserSync.stream());
}


function main(){
    return gulp.src(index)
        .pipe(concat('index.html'))
        .pipe(gulp.dest('./build'))
        .pipe(browserSync.reload);
}

function clean(){
    return del(['./build/*'])
}

function watch(){
    browserSync.init({
        server: {
            baseDir: "./build"
        }
    });
    gulp.watch('/src/scss/*.scss', gulp.series(css, transformMoveCSS));
    gulp.watch('/src/js/*.js', script);
    gulp.watch('/src/*.html').on('change', browserSync.reload);
}

gulp.task('styles', gulp.series(css, transformMoveCSS));
gulp.task('script', script);
gulp.task('main', main);
gulp.task('del', clean);
gulp.task('watch', watch);
gulp.task('build', gulp.series(clean, gulp.series(css, transformMoveCSS), gulp.parallel(script, main)));
gulp.task('dev', gulp.series('build', 'watch'));