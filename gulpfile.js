const gulp = require('gulp');
const zip = require('gulp-zip');
 
gulp.task('default', () =>
    gulp.src('src/*')
        .pipe(gulp.dest('../../../Qlik/Sense/Extensions/QSExtFileUpload'))
        .pipe(zip('QSExtFileUpload.zip'))
        .pipe(gulp.dest('dist'))
);