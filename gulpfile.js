var gulp = require('gulp');
var gutil = require('gulp-util');
var webpack = require('webpack');
var webpackDevServer = require('webpack-dev-server');
var webpackConfig = require('./webpack.config.js');

var PATHS = {
  src: {
    ts: 'app/**/*.ts',
    html: ['!node_modules/**', '**/*.html'],
    css: ['!node_modules/**', '**/*.css']
  },
  shims: [
    'node_modules/angular2/bundles/angular2-polyfills.js',
    'node_modules/es6-shim/es6-shim.js'
  ],
  lib: [
    'lib/*.js'
  ],
  dist: 'dist'
};

gulp.task('dist', ['html', 'css', 'libs']);

gulp.task('clean', function(done){
  var del = require('del');
  del([PATHS.dist, 'lib'], done);
});

gulp.task('html', function(){
  return gulp.src(PATHS.src.html).pipe(gulp.dest(PATHS.dist));
});

gulp.task('css', function(){
  return gulp.src(PATHS.src.css).pipe(gulp.dest(PATHS.dist));
});

gulp.task('libs', ['shims', 'webpack'], function(){
  return gulp.src(PATHS.lib).pipe(gulp.dest(PATHS.dist + '/lib'));
});

gulp.task('shims', function(){
  return gulp.src(PATHS.shims).pipe(gulp.dest('lib'));
});

gulp.task('ts-lint', function(){
  var tslint = require('gulp-tslint');
  return gulp.src(PATHS.src.ts).pipe(tslint()).pipe(tslint.report('prose'));
});

gulp.task('webpack', function(callback) {
  webpackConfig.plugins = [
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false
      }
    })
  ];
  // run webpack
  webpack(webpackConfig, function(err, stats) {
    if(err){
      throw new gutil.PluginError("webpack", err);
    }
    gutil.log("[webpack]", stats.toString({
      colors: true
    }));
    callback();
  });
});

gulp.task('play', ['shims'], function(callback) {
  var compiler = webpack(webpackConfig);
  var open = require('open');

  new webpackDevServer(compiler, {
    publicPath: "/" + webpackConfig.output.publicPath,
    stats: {
      colors: true
    }
  }).listen(8080, "localhost", function(err) {
    if(err){
      throw new gutil.PluginError("webpack-dev-server", err);
    }
    // Server listening
    gutil.log("[webpack-dev-server]", "http://localhost:8080/index.html");
    open('http://localhost:8080/index.html');
  });
});

gulp.task('serve-dist', ['dist'], function() {
  var http = require('http');
  var connect = require('connect');
  var serveStatic = require('serve-static');
  var open = require('open');

  var app = connect().use(serveStatic(__dirname + '/dist'));
  http.createServer(app).listen(3000, function() {
    gutil.log('[serve-dist]', 'Serving from /dist on http://localhost:3000')
    open('http://localhost:' + 3000);
  });
});
