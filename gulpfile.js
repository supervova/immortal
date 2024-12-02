/* eslint-disable no-console */
/**
 * -----------------------------------------------------------------------------
 * 📥 IMPORTS AND CONSTANTS
 * -----------------------------------------------------------------------------
 */
// #region
import { src, dest, watch, series, parallel } from 'gulp';

// import purge from '@fullhuman/postcss-purgecss';
import * as sass from 'sass';
import browserSync from 'browser-sync';
import changed from 'gulp-changed';
import cssnano from 'cssnano';
import futureFeatures from 'postcss-preset-env';
import gulpSass from 'gulp-sass';
// import gulpif from 'gulp-if';
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
import prettify from 'gulp-prettier';
import replace from 'gulp-replace';
import size from 'gulp-size';
// import sourcemaps from 'gulp-sourcemaps';
import svgSprite from 'gulp-svg-sprite';
import twig from 'gulp-twig';
import yargs from 'yargs';
import { createGulpEsbuild } from 'gulp-esbuild';
import { deleteAsync } from 'del';
import { existsSync } from 'fs';
import { hideBin } from 'yargs/helpers';
import { join } from 'path';

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
  dest: {
    prod: './public', // для production
    dev: './dist', // для разработки
    assets: './public/assets', // assets всегда в public
  },
};

const srcBase = root.src;
const destAssets = root.dest.assets;

const paths = {
  css: {
    src: {
      main: `${srcBase}/assets/scss/main.scss`,
      home: `${srcBase}/assets/scss/pages/home.scss`,
      onboarding: `${srcBase}/assets/scss/pages/onboarding.scss`,
    },
    watch: `${srcBase}/assets/scss/**/*.scss`,
    tmp: `${srcBase}/assets/css/`,
    dest: `${destAssets}/css/`,
  },
  markup: {
    src: {
      twig: [
        `${srcBase}/templates/**/*.twig`,
        `!${srcBase}/templates/base/*.twig`,
        `!${srcBase}/templates/components/*.twig`,
      ],
    },
    watch: [`${srcBase}/templates/**/*.twig`, `${destAssets}/css/home.css`],
    dest: `${root.dest.dev}`,
  },
  img: {
    src: [
      `${srcBase}/assets/img/**/*.{jpg,png,gif,svg}`,
      `!${srcBase}/assets/img/icons/*.svg`,
      `!${srcBase}/assets/img/icons-bg/*`,
    ],
    dest: `${destAssets}/img/`,
  },
  svg: {
    src: `${srcBase}/assets/img/icons/*.svg`,
    dest: `${destAssets}/img`,
  },
  js: {
    src: `${srcBase}/assets/js`, // папка с исходниками
    entry: {
      main: `${srcBase}/assets/js/main.js`, // основная точка входа
      home: `${srcBase}/assets/js/home.js`,
    },
    watch: `${srcBase}/assets/js/*.js`,
    dest: `${destAssets}/js/`,
  },
  video: {
    src: `${srcBase}/assets/video/**/*.mp4`,
    dest: `${destAssets}/video`,
  },
  fonts: {
    src: `${srcBase}/assets/fonts/**/*.{woff2,ttf}`,
    dest: `${destAssets}/fonts/`,
  },
};

// #endregion

/**
 * -----------------------------------------------------------------------------
 * 🛠 UTILITIES
 * -----------------------------------------------------------------------------
 */
// #region
const cleanDist = () =>
  deleteAsync([
    `${root.dest.dev}/**/*`, // Очищаем dist
    `${paths.css.dest}/**/*.css`,
    `${paths.js.dest}/**/*.js`,
    `${paths.img.dest}/**/*`,
  ]);

const cleanPages = () => deleteAsync([`${paths.markup.dest}/**/*.html`]);

const cleanSrc = () => deleteAsync([`${srcBase}/**/*.css`]);

const clean = parallel(cleanDist, cleanSrc, cleanPages);
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
  const entries = Object.entries(paths.js.entry);

  return Promise.all(
    entries.map(([name, entry]) =>
      src(entry)
        .pipe(handleError('JS Compile Error'))
        .pipe(
          gulpEsbuild({
            outfile: `${name}.js`,
            bundle: true,
            format: PRODUCTION ? 'iife' : 'esm', // В разработке поддерживаем ESM
            minify: PRODUCTION,
            define: {
              'process.env.NODE_ENV': JSON.stringify(
                PRODUCTION ? 'production' : 'development'
              ),
            },
          }).on('error', function errorHandler(err) {
            console.error('Error in esbuild:', err.message);
            this.emit('end');
          })
        )
        .pipe(dest(paths.js.dest))
        .pipe(bsInstance.stream())
    )
  );
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

const copyFonts = () =>
  src(paths.fonts.src, { encoding: false })
    .pipe(changed(paths.fonts.dest))
    .pipe(dest(paths.fonts.dest));

const copy = parallel(copyFonts, copyVideo);
// #endregion

/**
 * -----------------------------------------------------------------------------
 * 🖼 IMAGES
 * -----------------------------------------------------------------------------
 */
// #region
const img = (done) => {
  src(paths.img.src, { encoding: false })
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
    .pipe(size({ title: 'images' }));
  done();
};
// #endregion

/**
 * -----------------------------------------------------------------------------
 * 📰 PAGES
 * -----------------------------------------------------------------------------
 */
// #region

const pages = (done) => {
  src(paths.markup.src.twig, { base: './src/templates' })
    .pipe(
      plumber({
        handleError(err) {
          console.log(err);
          this.emit('end');
        },
      })
    )
    .pipe(
      twig({
        base: './src/templates',
        filters: [
          {
            name: 'trans',
            func(string) {
              return string;
            },
          },
        ],
      })
    )
    .on('error', function errorHandler(err) {
      process.stderr.write(`${err.message}\n`);
      this.emit('end');
    })
    .pipe(replace(/\{\$(.*?)\}/g, ''))
    .pipe(prettify({ printWidth: 40000, bracketSameLine: true }))
    .pipe(replace(/ (\s*<style>\n)\s*@charset "UTF-8";/g, '$1'))
    .pipe(replace(/\s\/>/g, '>'))
    .pipe(size({ title: 'html' }))
    .pipe(dest(paths.markup.dest))
    .pipe(bsInstance.stream());
  done();
};
// #endregion

/**
 * -----------------------------------------------------------------------------
 * 🎨 STYLES
 * -----------------------------------------------------------------------------
 */
// #region
// const selectorsToIgnore = ['button', /^(is-|has-)/, /^(.*?)(m|p)(t|b)-/];

const processStyles = (
  source,
  subtitle,
  destination
  // purgeContent,
  // forceProduction = false
) =>
  src(source)
    .pipe(newer(destination))
    .pipe(
      plumber({
        errorHandler: notify.onError('Error: <%= error.message %>'),
      })
    )
    // .pipe(gulpif(!(PRODUCTION || forceProduction), sourcemaps.init()))
    .pipe(
      sassCompiler({
        precision: 4,
        includePaths: ['.'],
      }).on('error', function errorHandler(err) {
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
        cssnano({
          preset: [
            'lite',
            {
              normalizeWhitespace: false,
            },
          ],
        }),
      ])
    )
    // .pipe(gulpif(!(PRODUCTION || forceProduction), sourcemaps.write()))
    .pipe(size({ title: `styles: ${subtitle}` }))
    .pipe(dest(destination))
    .pipe(bsInstance.stream());

const cssBase = (done) => {
  processStyles(
    paths.css.src.main,
    'main',
    paths.css.dest
    // [`${srcBase}/pages/uncss/**/*.html`]
  );
  done();
};

const cssHome = (done) => {
  processStyles(
    paths.css.src.home,
    'home',
    paths.css.dest,
    // [`${srcBase}/pages/uncss/**/*.html`],
    true // Force production mode
  );
  done();
};

const cssOnboarding = (done) => {
  processStyles(
    paths.css.src.onboarding,
    'onboarding',
    paths.css.dest,
    // [`${srcBase}/pages/uncss/**/*.html`],
    true // Force production mode
  );
  done();
};

const css = series(cssBase, cssHome, cssOnboarding);
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

const sprite = series(svg, parallel(css, img));
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
  watch(paths.js.watch, series(js));
  watch([paths.markup.watch], series(pages));
  watch(paths.svg.src, series(svg, parallel(css, img), reload));
  watch(paths.img.src, series(img, reload));
};

const serve = (done) => {
  bsInstance.init({
    server: {
      baseDir: root.dest.dev, // Основная директория - dist
      routes: {
        '/assets': root.dest.assets,
        '/manifest.json': `${root.dest.prod}/manifest.json`,
      },
    },
    port: 9000,
    notify: false,

    // Extensionless URLs
    middleware: [
      (req, res, next) => {
        const baseDir = root.dest.dev;

        // Если URL корневой, перенаправляем на index.html
        if (req.url === '/') {
          req.url = '/index.html';
        } else {
          // Проверка: если URL заканчивается на `/`, ищем index.html
          const dirPath = join(baseDir, req.url, 'index.html');
          if (req.url.endsWith('/') && existsSync(dirPath)) {
            req.url += 'index.html';
          } else if (!/\.\w+$/.test(req.url)) {
            // Если нет расширения, проверяем, существует ли index.html в директории
            const potentialIndex = join(baseDir, req.url, 'index.html');
            if (existsSync(potentialIndex)) {
              req.url += '/index.html';
            } else {
              // Иначе просто добавляем .html к URL
              req.url += '.html';
            }
          }
        }

        next();
      },
    ],
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
const build = series(clean, svg, parallel(img, css, js, copyVideo));

const dev = series(build, pages, serve);
// #endregion

/**
 * -----------------------------------------------------------------------------
 * ☑️ TASKS
 * -----------------------------------------------------------------------------
 */
export {
  clean,
  copy,
  pages,
  sprite,
  img,
  js,
  css,
  dev,
  serve,
  watchFiles as w,
};

export default build;
