var gulp = require('gulp');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');

gulp.task('clean', function () {
    return gulp.src('Z:/sites/organigramme/client/')
        .pipe(clean());
});

gulp.task('default', function (callback) {
    runSequence(
        'clean',
        'autoprefixer',
        'copy',
        callback);
});

