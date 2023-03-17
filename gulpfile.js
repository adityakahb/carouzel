const browserSync = require(`browser-sync`).create();
const cleanCSS = require(`gulp-clean-css`);
const fileinclude = require(`gulp-file-include`);
const gulp = require(`gulp`);
const rename = require(`gulp-rename`);
const replace = require('gulp-replace');
const sass = require(`gulp-sass`)(require(`sass`));
const sourcemaps = require(`gulp-sourcemaps`);
const ts = require(`gulp-typescript`);
const tsProject = ts.createProject(`tsconfig.json`);
const uglify = require('gulp-uglify');

gulp.task(`sass-carouzel`, function () {
  return gulp
    .src(`./src/sass/carouzel.scss`)
    .pipe(sourcemaps.init())
    .pipe(sass.sync().on(`error`, sass.logError))
    .pipe(
      sourcemaps.write(`.`, {
        includeContent: false,
        sourceRoot: `./dist/styles`
      })
    )
    .pipe(gulp.dest(`./dist/styles`));
});

gulp.task(`minify-css`, () => {
  return gulp
    .src([`./dist/styles/carouzel.css`])
    .pipe(cleanCSS())
    .pipe(rename({ suffix: `.min` }))
    .pipe(gulp.dest(`./dist/styles`));
});

gulp.task(`uglifyjs`, function () {
  return gulp
    .src('./dist/scripts/carouzel.js', { base: './' })
    .pipe(uglify())
    .pipe(rename({ suffix: `.min` }))
    .pipe(gulp.dest('./'));
});

gulp.task(`es3js`, function () {
  return gulp
    .src('./dist/scripts/carouzel.min.js', { base: './' })
    .pipe(
      replace('"use strict";', '"use strict";\nvar exports = exports || {};')
    )
    .pipe(rename({ suffix: `.es3` }))
    .pipe(gulp.dest('./'));
});

gulp.task(`typescript`, function () {
  return tsProject
    .src()
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(
      sourcemaps.write(`.`, {
        includeContent: false,
        sourceRoot: `./dist/scripts`
      })
    )
    .pipe(gulp.dest(`dist/scripts`));
});

gulp.task(`browserSync`, function (done) {
  browserSync.init({
    files: `./index.html`,
    server: `./`,
    port: 3001
  });
  done();
});

gulp.task(`fileinclude`, function () {
  return gulp
    .src([`./src/*.html`])
    .pipe(
      fileinclude({
        prefix: `@@`,
        basepath: `@file`
      })
    )
    .pipe(gulp.dest(`./`));
});

gulp.task(
  `watch`,
  gulp.series(
    `typescript`,
    `sass-carouzel`,
    `uglifyjs`,
    `minify-css`,
    `fileinclude`,
    `browserSync`,
    `es3js`,
    function () {
      gulp.watch(
        `./src/**/*.{html,ts,scss}`,
        gulp.series(
          `typescript`,
          `sass-carouzel`,
          `uglifyjs`,
          `minify-css`,
          `fileinclude`,
          `es3js`
        )
      );
      browserSync.reload(`./index.html`);
    }
  )
);

gulp.task(`default`, gulp.series([`fileinclude`]));
