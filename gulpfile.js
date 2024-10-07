/* eslint-disable no-console */
/**
 * -----------------------------------------------------------------------------
 * 📥 IMPORTS AND CONSTANTS
 * -----------------------------------------------------------------------------
 */
// #region
import { src, dest, watch, series, parallel } from 'gulp';

import * as sass from 'sass';
import browserSync from 'browser-sync';
import changed from 'gulp-changed';
import cssnano from 'cssnano';
import futureFeatures from 'postcss-preset-env';
import gulpSass from 'gulp-sass';
import gulpif from 'gulp-if';
import imagemin from 'gulp-imagemin';
import imageminGIF from 'imagemin-gifsicle';
import imageminJPG from 'imagemin-mozjpeg';
import imageminPNG from 'imagemin-pngquant';
import imageminSVG from 'imagemin-svgo';
import inlineSvg from 'postcss-inline-svg';
import newer from 'gulp-newer';
import notify from 'gulp-notify';
import plumber from 'gulp-plumber';
import postcss from 'gulp-postcss';
import pug from 'gulp-pug';
import size from 'gulp-size';
import sourcemaps from 'gulp-sourcemaps';
import svgSprite from 'gulp-svg-sprite';
import yargs from 'yargs';
import { createGulpEsbuild } from 'gulp-esbuild';
import { deleteAsync } from 'del';
import { hideBin } from 'yargs/helpers';

const bsInstance = browserSync.create();
const gulpEsbuild = createGulpEsbuild();

const sassCompiler = gulpSass(sass);

const { argv } = yargs(hideBin(process.argv));
const PRODUCTION = argv.p;
// #endregion

/**
 * -----------------------------------------------------------------------------
 * 👉 PATHS
 * -----------------------------------------------------------------------------
 */
// #region
const root = {
  src: './src',
  tmp: './src/assets',
  dest: {
    site: './dist',
    assets: './dist/assets',
  },
};

const srcBase = root.src;
const destAssets = root.dest.assets;

const paths = {
  css: {
    src: {
      main: `${srcBase}/main.scss`,
    },
    watch: `${srcBase}/**/*.scss`,
    tmp: `${srcBase}/assets/css/`,
    dest: `${destAssets}/css/`,
  },
  markup: {
    src: {
      pug: [`${srcBase}/pages/**/*.pug`, `!${srcBase}/pages/pug/*.pug`],
    },
    watch: [`${srcBase}/**/*.pug`],
    dest: `${root.dest.site}`,
  },
  img: {
    src: {
      graphics: [
        `${srcBase}/**/*.{jpg,png,gif,svg}`,
        `!${srcBase}/base/graphics/sprite/*.svg`,
        `!${srcBase}/img/**/*`,
      ],
      content: `${srcBase}/img/**/*.{jpg,png,gif,svg,webp}`,
    },
    watch: [
      `${srcBase}/**/*.{jpg,png,gif,svg}`,
      `!${srcBase}/base/graphics/sprite/*.svg`,
    ],
    dest: `${destAssets}/img/`,
  },
  svg: {
    src: `${srcBase}/base/graphics/sprite/*.svg`,
    dest: `${srcBase}/base/graphics`,
  },
  js: {
    src: `${srcBase}/main.js`,
    dest: `${destAssets}/js/`,
  },
  video: {
    src: [`${srcBase}/**/*.mp4`, `!${srcBase}/_arj/**/*.mp4`],
    dest: `${destAssets}/video`,
  },
  rootFiles: {
    src: ['./*.html', './CNAME', './favicon.ico', 'manifest.json'],
    dest: `${root.dest.site}`,
  },
};
// #endregion

/**
 * -----------------------------------------------------------------------------
 * 🛠 UTILITIES
 * -----------------------------------------------------------------------------
 */
// #region
const clean = () =>
  deleteAsync([
    `${paths.css.dest}/**/*.css`,
    `${paths.js.dest}/**/*.js`,
    `${paths.img.dest}/**/*.img`,
  ]);
const cleanSrc = () => deleteAsync([`${srcBase}/**/*.css`]);
// #endregion

/**
 * -----------------------------------------------------------------------------
 * 💾 SCRIPTS
 * -----------------------------------------------------------------------------
 */
// #region
const handleError = (title) => {
  return plumber({
    errorHandler: notify.onError({
      title,
      message: '<%= error.message %>',
    }),
  });
};

const js = () => {
  return src(paths.js.src)
    .pipe(handleError('JS Compile Error'))
    .pipe(
      gulpEsbuild({
        outfile: 'main.js',
        bundle: true,
        minify: PRODUCTION,
      }).on('error', function errorHandler(err) {
        // eslint-disable-next-line no-console
        console.error('Error in esbuild:', err.message);
        this.emit('end');
      })
    )
    .pipe(dest(paths.js.dest))
    .pipe(bsInstance.stream());
};
// #endregion

/**
 * -----------------------------------------------------------------------------
 * 👯‍♀️ COPY
 * -----------------------------------------------------------------------------
 */
// #region
const copyVideo = () =>
  src(paths.video.src, { encoding: false })
    .pipe(changed(paths.video.dest))
    .pipe(dest(paths.video.dest));
const copyRootFiles = () =>
  src(paths.rootFiles.src, { encoding: false })
    .pipe(changed(paths.rootFiles.dest))
    .pipe(dest(paths.rootFiles.dest));
// #endregion

/**
 * -----------------------------------------------------------------------------
 * 🖼 IMAGES
 * -----------------------------------------------------------------------------
 */
// #region
const imgTasks = (source, subtitle) =>
  src(source, { encoding: false })
    .pipe(newer(paths.img.dest))
    .pipe(
      imagemin(
        [
          imageminGIF({ interlaced: true, optimizationLevel: 3 }),
          imageminJPG({ quality: 85 }),
          imageminPNG({ quality: [0.85, 0.95] }),
          imageminSVG({
            plugins: [
              {
                name: 'removeViewBox',
                active: false,
              },
              {
                name: 'cleanupIds',
                params: {
                  remove: false,
                  minify: false,
                  preserve: [],
                  preservePrefixes: [],
                  force: false,
                },
              },
            ],
          }),
        ],
        { verbose: true }
      )
    )
    .pipe(dest(paths.img.dest))
    .pipe(size({ title: `images: ${subtitle}` }));

const imgGraphics = (done) => {
  imgTasks(paths.img.src.graphics, 'graphics');
  done();
};

const imgContent = (done) => {
  imgTasks(paths.img.src.content, 'content');
  done();
};

// OPTIMIZE
const img = parallel(imgGraphics, imgContent);
// #endregion

/**
 * -----------------------------------------------------------------------------
 * 🎨 STYLES
 * -----------------------------------------------------------------------------
 */
// #region
const processStyles = (source, subtitle, destination /* , purgeContent */) =>
  src(source)
    .pipe(newer(destination))
    .pipe(
      plumber({
        errorHandler: notify.onError('Error: <%= error.message %>'),
      })
    )
    .pipe(gulpif(!PRODUCTION, sourcemaps.init()))
    .pipe(
      sassCompiler({
        precision: 4,
        includePaths: ['.'],
      }).on('error', (err) => {
        console.error('Error compiling Sass:', err.message);
        this.emit('end');
      })
    )
    .pipe(dest(paths.css.tmp))
    .pipe(
      postcss([
        inlineSvg(),
        futureFeatures({
          stage: 2,
          features: {
            'cascade-layers': false,
            clamp: false,
            'color-mix': true,
            'custom-media-queries': true,
            'custom-properties': false,
            'custom-selectors': true,
            'font-variant-property': false,
            'has-pseudo-class': true,
            'image-set-function': true,
            'is-pseudo-class': false,
            'logical-properties-and-values': false,
            'media-query-ranges': true,
            'nesting-rules': true,
            'unset-value': true,
          },
          autoprefixer: { cascade: false },
        }),
        ...(PRODUCTION
          ? [
              // Uncomment and configure purge if needed
              // purge({
              //   content: purgeContent,
              //   dynamicAttributes: ['aria-selected'],
              //   fontFace: true,
              //   keyframes: true,
              //   safelist: selectorsToIgnore,
              //   variables: true,
              // }),
              cssnano({ reduceIdents: { keyframes: false } }),
            ]
          : [
              cssnano({
                preset: [
                  'lite',
                  {
                    normalizeWhitespace: false,
                  },
                ],
              }),
            ]),
      ])
    )
    .pipe(gulpif(!PRODUCTION, sourcemaps.write()))
    .pipe(size({ title: `styles: ${subtitle}` }))
    .pipe(dest(destination))
    .pipe(bsInstance.stream());

const css = (done) => {
  processStyles(
    paths.css.src.main,
    'main',
    paths.css.dest
    // [`${srcBase}/pages/uncss/**/*.html`]
  );
  done();
};
// #endregion

/**
 * -----------------------------------------------------------------------------
 * ❤️ SVG SPRITES
 * -----------------------------------------------------------------------------
 */
// #region

function svg() {
  return src(paths.svg.src)
    .pipe(
      svgSprite({
        mode: {
          symbol: {
            dest: '.', // Mode specific output directory
            sprite: 'sprite.svg', // Sprite path and name
            prefix: '.', // Prefix for CSS selectors
            dimensions: '', // Suffix for dimension CSS selectors
            example: true, // Create an HTML example document
          },
        },
        svg: {
          xmlDeclaration: false, // strip out the XML attribute
          doctypeDeclaration: false, // don't include the !DOCTYPE declaration
        },
      })
    )
    .pipe(dest(paths.svg.dest));
}

const sprite = series(svg, parallel(css, imgGraphics));
// #endregion

/**
 * -----------------------------------------------------------------------------
 * 📰 MARKUP
 * -----------------------------------------------------------------------------
 */
// #region
const buildPug = () =>
  src(paths.markup.src.pug)
    .pipe(plumber())
    .pipe(pug({ doctype: 'html', pretty: true, basedir: srcBase }))
    .pipe(size({ title: 'html' }))
    .pipe(dest(paths.markup.dest))
    .pipe(bsInstance.stream());
// #endregion

/**
 * -----------------------------------------------------------------------------
 * 📶 SERVER
 * -----------------------------------------------------------------------------
 */
// #region
const reload = (done) => {
  bsInstance.reload();
  done();
};

const watchFiles = () => {
  watch(paths.css.watch, series(css));
  watch(paths.js.src, series(js));
  watch(paths.markup.watch, series(buildPug));
  watch(paths.img.watch, series(img, reload));
  watch(paths.rootFiles.src, series(copyRootFiles, reload));
};

const serve = (done) => {
  bsInstance.init({
    server: { baseDir: root.dest.site },
    port: 9000,
    notify: false,
  });
  watchFiles();
  done();
};
// #endregion

/**
 * -----------------------------------------------------------------------------
 * 🏗️ BUILD AND SERVE
 * -----------------------------------------------------------------------------
 */
// #region
const build = series(
  clean,
  parallel(img, buildPug, css, js, copyVideo, copyRootFiles)
);

const dev = series(build, serve);

// #endregion

/**
 * -----------------------------------------------------------------------------
 * ☑️ TASKS
 * -----------------------------------------------------------------------------
 */

export {
  cleanSrc,
  clean,
  copyVideo as copy,
  copyRootFiles,
  buildPug as pug,
  sprite,
  img,
  js,
  css,
  dev,
  serve,
  watchFiles,
};

export default build;
