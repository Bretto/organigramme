var gulp = require('gulp');

var bases = {
    app: './',
    dist: 'Z:/sites/organigramme/client/'
};

var paths = {
    src: ['client/**/*'],
    css: ['client/style-prefixed/*']
};

gulp.task('copy', function() {

    gulp.src(paths.src, {cwd: bases.app})
        .pipe(gulp.dest(bases.dist));

});

gulp.task('copy2', function() {

    gulp.src(paths.css, {cwd: bases.app})
        .pipe(gulp.dest(bases.dist));

});
