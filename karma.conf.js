// Karma configuration
// Generated on Wed Jan 19 2022 19:52:33 GMT+0530 (India Standard Time)

module.exports = function (config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://www.npmjs.com/search?q=keywords:karma-adapter
    frameworks: ['jasmine', 'viewport'],

    // list of files / patterns to load in the browser
    files: [
      'dist/styles/site/index.css',
      'dist/styles/carouzel/carouzel.css',
      'dist/scripts/carouzel.js',
      'specs/carouzel.spec.js',
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

    // Viewport configuration
    viewport: {
      breakpoints: [
        {
          name: 'mobile',
          size: {
            width: 320,
            height: 480,
          },
        },
        {
          name: 'tablet',
          size: {
            width: 768,
            height: 1024,
          },
        },
        {
          name: 'desktop',
          size: {
            width: 1440,
            height: 900,
          },
        },
      ],
    },

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://www.npmjs.com/search?q=keywords:karma-launcher
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
  });
};
