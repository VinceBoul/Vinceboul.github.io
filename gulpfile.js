"use strict";

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var uglifycss = require('gulp-uglifycss');
var concat = require('gulp-concat');
var compass = require('gulp-compass');
var watch = require('gulp-watch');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');

var sourcesLibCSS = ['lib/css/*.css'];
var sourcesLibJS = ['lib/js/jquery.min.js', 'lib/js/*.js'];
var sourcesSASS = ['sass/**/*.scss', 'sass/*.scss'];

function compileJsFile(task,source,jsFile){
    gulp.task(task, function () {
        return gulp.src(source)
            .pipe(concat(jsFile))
            .pipe(sourcemaps.write())
           // .pipe(uglify())
            .pipe(gulp.dest('_js/'));
    });
}

function compileSassFile(task,source,sassFile){
    gulp.task(task, function () {
        return gulp.src(source)
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(compass({
            css: 'lib/css',
            sass: 'sass/'
          }))
        .pipe(sourcemaps.write())
        .pipe(concat(sassFile))
        .pipe(uglifycss())
        .pipe(gulp.dest('_css/'));
    });
}


// Compilation des librairies JS
compileJsFile('jsLib',sourcesLibJS,'vendor.js');
// Compilation de notre SASS
compileSassFile('petiteFleurSass', sourcesSASS, 'main.css');

//CSS TASK: écrit une fichier minifié vendor.css à partir de bootstrap.css
gulp.task('css', function () {
    console.log('css Task');
    return gulp.src(sourcesLibCSS)
        .pipe(concat('vendor.css'))
        .pipe(sourcemaps.write())
        .pipe(uglifycss())
        .pipe(gulp.dest('_css/'));
});

// Watch TASK : régénère les fichiers style.css et app.js lors de l'édition des fichiers JS et SASS
gulp.task('watch', function() 
{
    /*console.log('watch');
    gulp.watch(sourcesSASS, ['woodgeur']);
    gulp.watch(sourceWoodgeurJS, ['WoodgeurJS']);
    */

});

// Compass TASK : Génère un fichier style.css à partir des fichiers SASS dans app/Resources/public/sass/
gulp.task('compass', function() {
    return gulp.src(sourcesSASS)
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(compass({
            css: 'lib/css',
            sass: 'sass/'
          }))
        .pipe(sourcemaps.write())
        .pipe(uglifycss())
        .pipe(gulp.dest('_css'));
});

// Fonts
gulp.task('fonts', function() {
    return gulp.src([
        'lib/fonts/elegant-theme-line.*', 
        'lib/fonts/flexslider-icon.*', 
        'lib/fonts/glyphicons-halflings-regular.*'])
            .pipe(gulp.dest('fonts/'));
});

//IMAGE TASK: Just pipe images from project folder to public web folder
//gulp.task('img', function() {
  //  return gulp.src('app/Resources/public/img/**/*.*')
/*        .pipe(gulp.dest('web/img'));
});*/

/* Default TASK : se lance avec "gulp" dans l'invite de commande
   - éxécute les taches configurées. 
   - La dernière tache 'watch' attend l'édition des fichiers SASS et JS pour regénérer style.css et app.js 
*/
gulp.task('style', ['css', 'compass', 'petiteFleurSass']);
gulp.task('js', ['jsLib']);
gulp.task('default', ['style', 'js', 'fonts', 'watch']);