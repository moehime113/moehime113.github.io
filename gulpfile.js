const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const htmlmin = require('gulp-html-minifier-terser');
const htmlclean = require('gulp-htmlclean');
const fontmin = require('gulp-fontmin');
const terser = require('gulp-terser');

function compressJs() {
  return gulp
    .src(['./public/**/*.js', '!./public/**/*.min.js'])
    .pipe(
      terser().on('error', function onTerserError(err) {
        console.error('[gulp:compress-js]', err.toString());
        this.emit('end');
      })
    )
    .pipe(gulp.dest('./public'));
}

function minifyCss() {
  return gulp
    .src(['./public/**/*.css'])
    .pipe(
      cleanCSS({
        compatibility: 'ie11'
      })
    )
    .pipe(gulp.dest('./public'));
}

function minifyHtml() {
  return gulp
    .src('./public/**/*.html')
    .pipe(htmlclean())
    .pipe(
      htmlmin({
        removeComments: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeEmptyAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      })
    )
    .pipe(gulp.dest('./public'));
}

function walkDirForExt(dirPath, ext, results) {
  if (!fs.existsSync(dirPath)) return;

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  entries.forEach((entry) => {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      walkDirForExt(fullPath, ext, results);
    } else if (entry.isFile() && fullPath.toLowerCase().endsWith(ext)) {
      results.push(fullPath.replace(/\\/g, '/'));
    }
  });
}

function getTtfFiles() {
  const files = [];
  walkDirForExt('./public/font', '.ttf', files);
  walkDirForExt('./public/fonts', '.ttf', files);
  return files;
}

function miniFont(cb) {
  const ttfFiles = getTtfFiles();
  if (ttfFiles.length === 0) {
    console.log('[gulp:mini-font] No .ttf files found in public/font or public/fonts, skip font minify.');
    cb();
    return;
  }

  const buffers = [];
  gulp
    .src(['./public/**/*.html'])
    .on('data', (file) => {
      if (file.contents) buffers.push(file.contents);
    })
    .on('end', () => {
      const text = Buffer.concat(buffers).toString('utf-8');
      if (!text) {
        console.log('[gulp:mini-font] No html text collected, skip font minify.');
        cb();
        return;
      }

      gulp
        .src(ttfFiles, { allowEmpty: true })
        .pipe(
          fontmin({
            text
          })
        )
        .pipe(gulp.dest('./public/fontsdest/'))
        .on('end', cb)
        .on('error', (err) => {
          console.error('[gulp:mini-font]', err.toString());
          cb(err);
        });
    })
    .on('error', (err) => {
      console.error('[gulp:mini-font]', err.toString());
      cb(err);
    });
}

gulp.task('compress', compressJs);
gulp.task('minify-css', minifyCss);
gulp.task('minify-html', minifyHtml);
gulp.task('mini-font', miniFont);

gulp.task('default', gulp.parallel('compress', 'minify-css', 'minify-html', 'mini-font'));
