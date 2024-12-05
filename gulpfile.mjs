// Import necessary modules
import gulp from 'gulp';
import sass from 'gulp-sass';
import * as sassCompiler from 'sass'; // Updated import for Sass
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import imagemin from 'gulp-imagemin';
import browserSync from 'browser-sync';
import replace from 'gulp-replace';

// Set up Gulp-Sass with the Sass compiler
const compileSass = sass(sassCompiler);

// Task to copy HTML files to dist
gulp.task('html', function () {
    return gulp.src("src/*.html")
        .pipe(replace(/href="scss\/styles\.scss"/, 'href="css/styles.min.css"')) // Replace with your path
        .pipe(gulp.dest("dist"));
});

// Task to compile Sass into CSS
gulp.task("sass", function () {
    return gulp.src("src/scss/*.scss") // Ensure this points to your .scss files
        .pipe(compileSass().on('error', compileSass.logError))
        .pipe(rename('styles.min.css'))
        .pipe(gulp.dest("dist/css"));
});

// Task to concatenate and minify JavaScript files
gulp.task("scripts", function () {
    return gulp.src("src/js/*.js")
        .pipe(concat('scripts.js'))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest("dist/js"));
});

// Task to copy data files like JSON or other assets
gulp.task('data', function () {
    return gulp.src("src/data/**/*")
        .pipe(gulp.dest("dist/data"))
        .pipe(browserSync.stream()); // Trigger a reload after copying data files
});

// Task to reload the browser
gulp.task('reload', function (done) {
    browserSync.reload(); // Reloads the browser
    done();
});



// Task to compress img
gulp.task('imgs', function () {
    return gulp.src("src/img/*.+(jpg|jpeg|png|gif|webp|svg)", { encoding: false })
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            interlaced: true
        }))
        .pipe(gulp.dest("dist/img"));
});

// Task for browser-sync
gulp.task('browser-sync', function () {
    browserSync.create().init({
        server: {
            baseDir: "dist/"
        }
    });
});

// Watch task to monitor changes in files
gulp.task("watch", function () {
    gulp.watch("src/*.html", gulp.series("html"));
    gulp.watch("src/scss/*.scss", gulp.series("sass"));
    gulp.watch("src/js/*.js", gulp.series("scripts"));
    gulp.watch("src/img/*.+(jpg|jpeg|png|gif|webp|svg)", gulp.series("imgs"));
    gulp.watch("src/data/**/*", gulp.series("data", function(done) {
        browserSync.reload(); // Ensure the page reloads after data change
        done(); // Indicate task completion
    }));
});


// Default task to run when `gulp` is called
gulp.task("default", gulp.parallel("html", "sass", "scripts", "imgs", "watch"));
