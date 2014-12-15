var gulp = require('gulp');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');

var dtsi = 'Z:/sites/organigramme/client/';

gulp.task('clean', function () {
    return gulp.src()
        .pipe(clean());
});

//gulp.task('default', function (callback) {
//    runSequence(
//        'clean',
//        'autoprefixer',
//        'copy',
//        callback);
//});


gulp.task('default', function (callback) {
    runSequence(
        'autoprefixer',
        callback);
});

