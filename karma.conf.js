// Karma configuration
// Generated on Thu Dec 30 2021 16:06:50 GMT+0530 (India Standard Time)

module.exports = function (config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://www.npmjs.com/search?q=keywords:karma-adapter
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'dist/styles/site/index.css',
      'dist/styles/carouzel/carouzel.css',
      'dist/scripts/carouzel.js',
      'spec/carouzel.spec.js',
    ],

    // list of files / patterns to exclude
    exclude: [
      'dist/styles/site/index.css',
      'dist/styles/carouzel/carouzel.css',
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://www.npmjs.com/search?q=keywords:karma-preprocessor
    preprocessors: {
      'dist/scripts/carouzel.js': ['coverage'],
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://www.npmjs.com/search?q=keywords:karma-reporter
    reporters: ['coverage', 'kjhtml'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://www.npmjs.com/search?q=keywords:karma-launcher
    // browsers: ['Chrome', 'Firefox', 'IE', 'PhantomJS'],
    browsers: ['Chrome'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser instances should be started simultaneously
    concurrency: Infinity,

    client: {
      clearContext: false,
      jasmine: {
        random: false, // disable the random running order
      },
    },

    // optionally, configure the reporter
    coverageReporter: {
      type: 'html',
      dir: 'coverage/',
      instrumenterOptions: {
        istanbul: { noCompact: true },
      },
    },
  });
};
