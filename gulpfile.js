var gulp = require('gulp');
var jsmin = require('gulp-jsmin');
var rename = require("gulp-rename");
var browserSync = require('browser-sync').create();
var image = require('gulp-image');
var imagemin = require('gulp-imagemin');
var htmlmin = require('gulp-htmlmin');
var cleanCSS = require('gulp-clean-css');
var concatCss = require('gulp-concat-css');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var htmlbeautify = require('gulp-html-beautify');

var outputDir = './';

gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: outputDir
        }
    });
});
gulp.task('minificadorhtml', function () {
    return gulp.src('./*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('eloqua/'))
        .pipe(browserSync.stream())
});
gulp.task('minificadorjs', function () {
    gulp.src('assets/js/*.js')
        .pipe(concat('main.js'))
        .pipe(jsmin())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('eloqua/js/'))
        .pipe(browserSync.stream())
});
gulp.task('minificadorcss', function () {
    return gulp.src('assets/css/*.css')
        .pipe(concatCss("main.css"))
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('eloqua/css/'))
        .pipe(browserSync.stream())
});
gulp.task('unminificadorhtml', function() {
    gulp.src('./*.html')
      .pipe(htmlbeautify({
          indentSize: 4,
          "jslint_happy": true,
        }))
      .pipe(gulp.dest('./'))
  });
gulp.task('sass', function () {
    return gulp.src('assets/scss/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('assets/css/'));
  });
gulp.task('optimizadorjpg', function () {
    gulp.src('assets/img/*.jpg')
        .pipe(image())
        .pipe(gulp.dest('eloqua/img/'))
});
gulp.task('optimizadorpng', function () {
    gulp.src('assets/img/*.png')
        .pipe(imagemin([
            imagemin.optipng({ optimizationLevel: 10 })
        ]))
        .pipe(gulp.dest('eloqua/img/'))
});
gulp.task('optimizadorsvg', function () {
    gulp.src('assets/img/*.svg')
        .pipe(imagemin())
        .pipe(gulp.dest('eloqua/img/'))
});
gulp.task('optimizadorgif', function () {
    gulp.src('assets/img/*.gif')
        .pipe(imagemin([
            imagemin.gifsicle({ interlaced: true }),
        ]))
        .pipe(gulp.dest('eloqua/img/'))
});

gulp.task('watch', ['browser-sync', 'minificadorjs', 'optimizadorjpg', 'optimizadorpng', 'minificadorhtml', 'minificadorcss','sass'], function () {
    gulp.watch('index.html', ['browser-sync']);
    gulp.watch('assets/js/*.js', ['minificadorjs']);
    gulp.watch('./*.html', ['minificadorhtml']);
    gulp.watch('assets/scss/*', ['sass']);
    gulp.watch('assets/css/*.css', ['minificadorcss']);
    gulp.watch('assets/img/*', ['optimizadorjpg','optimizadorpng']);
})
gulp.task('default', ['browser-sync', 'minificadorjs', 'optimizadorjpg', 'optimizadorpng', 'minificadorhtml', 'minificadorcss', 'watch']);