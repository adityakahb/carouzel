const browserSync = require(`browser-sync`).create();
const cleanCSS = require(`gulp-clean-css`);
const fileinclude = require(`gulp-file-include`);
const gulp = require(`gulp`);
const gulpCopy = require('gulp-copy');
// const jest = require('gulp-jest').default;
const jest = require('jest-cli');
const rename = require(`gulp-rename`);
const sass = require(`gulp-sass`)(require(`sass`));
const sourcemaps = require(`gulp-sourcemaps`);
const ts = require(`gulp-typescript`);
const tsProject = ts.createProject(`tsconfig.json`);
const uglify = require(`gulp-uglify`);
const jestconfig = require(`./jest.config`);

gulp.task(`sass-carouzel`, function () {
  return gulp
    .src(`./src/sass/carouzel/carouzel.scss`)
    .pipe(sourcemaps.init())
    .pipe(sass.sync().on(`error`, sass.logError))
    .pipe(
      sourcemaps.write(`.`, {
        includeContent: false,
        sourceRoot: `./dist/styles`,
      })
    )
    .pipe(gulp.dest(`./dist/styles`));
});

gulp.task(`sass-site`, function () {
  return gulp
    .src(`./src/sass/sass-site/site.scss`)
    .pipe(sass.sync().on(`error`, sass.logError))
    .pipe(gulp.dest(`./dist/styles`));
});

gulp.task(`minify-css`, () => {
  return gulp
    .src([`./dist/styles/carouzel.css`, `./dist/styles/site.css`])
    .pipe(cleanCSS())
    .pipe(rename({ suffix: `.min` }))
    .pipe(gulp.dest(`./dist/styles`));
});

gulp.task(`uglifyjs`, function () {
  return gulp
    .src(`./dist/scripts/carouzel.js`)
    .pipe(uglify())
    .pipe(rename({ suffix: `.min` }))
    .pipe(gulp.dest(`./dist/scripts`));
});

gulp.task(`typescript`, function () {
  return tsProject
    .src()
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(
      sourcemaps.write(`.`, {
        includeContent: false,
        sourceRoot: `./dist/scripts`,
      })
    )
    .pipe(gulp.dest(`dist/scripts`));
});

gulp.task(`browserSync`, function (done) {
  browserSync.init({
    files: `./index.html`,
    server: `./`,
  });
  done();
});

gulp.task(`fileinclude`, function () {
  return gulp
    .src([`./src/*.html`])
    .pipe(
      fileinclude({
        prefix: `@@`,
        basepath: `@file`,
      })
    )
    .pipe(gulp.dest(`./`));
});

gulp.task(
  `watch`,
  gulp.series(
    `typescript`,
    `sass-carouzel`,
    `sass-site`,
    `uglifyjs`,
    `minify-css`,
    `fileinclude`,
    `browserSync`,
    function () {
      gulp.watch(
        `./src/**/*.{html,ts,scss}`,
        gulp.series(
          `typescript`,
          `sass-carouzel`,
          `sass-site`,
          `uglifyjs`,
          `minify-css`,
          `fileinclude`
        )
      );
      browserSync.reload(`./index.html`);
    }
  )
);

gulp.task(`default`, gulp.series([`fileinclude`]));

gulp.task(`browserSync-for-test`, function (done) {
  browserSync.init({
    server: './tests',
    port: 3001,
  });
  done();
});

gulp.task(`copy-for-test`, function () {
  return gulp
    .src([
      './dist/scripts/carouzel.js',
      './dist/styles/carouzel.min.css',
      './dist/styles/site.min.css',
    ])
    .pipe(gulp.dest('./tests/resources'));
});

async function testJS() {
  const testResults = await jest.runCLI({ json: false }, ['./tests']);
  const { results } = testResults;
  const isTestFailed = !results.success;
  if (isTestFailed) {
    console.log('You have some failed test cases, kindly fix');
    process.exit(); // Breaks Gulp Pipe
  }
}

gulp.task(
  `test`,
  gulp.series('copy-for-test', 'browserSync-for-test', function () {
    return gulp.src('./tests').pipe(jest());
  })
);
