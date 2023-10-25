// Sass configuration
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const rename = require("gulp-rename");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var tsify = require("tsify");


// Styles
gulp.task('styles', function(callback) {
	gulp
		.src('./src/styles/style.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(rename('style.css'))
		.pipe(gulp.dest('./dist/'));
	return callback();
});

// Scripts
gulp.task('scripts', function() {

	return browserify({
      basedir: ".",
      debug: true,
      entries: ["src/scripts/main.ts"],
      cache: {},
      packageCache: {},
    })
      .plugin(tsify)
      .bundle()
      .pipe(source("main.js"))
      .pipe(gulp.dest("dist"));
});

// The watch task
gulp.task(
	'watch',
	function(){
		gulp.watch('./src/styles/**/*.scss', gulp.series('styles'));
		gulp.watch('./src/scripts/**/*.ts', gulp.series('scripts'));
	}
);

// The dec task, which compiles and then watches
gulp.task('dev', gulp.series('styles', 'scripts', 'watch'));

// Set the dev task as default
gulp.task('default', gulp.series('dev'));