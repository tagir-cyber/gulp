const { src, dest, series, watch, parallel } = require("gulp");
const fileinclude = require("gulp-file-include");
const sass = require("gulp-sass")(require("sass"));
const browserSync = require("browser-sync").create();
const gcmq = require('gulp-group-css-media-queries');


function serve() {
  browserSync.init({
    server: {
      baseDir: "./app/public",
    },
  });

  watch("./app/src/**/*.scss", styles);
  watch("./app/src/**/*.html").on("change", joinHtml);
  watch("./app/src/scripts/*.js").on("change", scripts);
}

function joinHtml() {
  return src(["./app/src/pages/*.html"])
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(dest("./app/public"))
    .pipe(browserSync.stream());
}

function scripts(){
  return src("./app/src/scripts/main.js")
  .pipe(dest("./app/public/js"))
  .pipe(browserSync.stream());
}

function styles() {
  return src("./app/src/styles/style.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(gcmq())
    .pipe(dest("./app/public/css"))
    .pipe(browserSync.stream());
}

// Задачи для подключения swiper 
function swiperStyles(){
  return src("./node_modules/swiper/swiper-bundle.min.css")
  .pipe(sass().on("error", sass.logError))
  .pipe(dest("./app/public/css/libs"))
}


// Задачи для подключения swiper 
function swiperScripts(){
  // return src("./node_modules/swiper/swiper-bundle.min.js")
  return src("./node_modules/typed.js/dist/typed.umd.js")
  .pipe(dest("./app/public/js/libs"))
}



// Экспорт для подключения библиотек
exports.swipes = parallel(swiperStyles, swiperScripts);

exports.typed = swiperScripts;

exports.default = series(joinHtml, styles, scripts, serve);
// exports.media = series(joinHtml, mediaStyles, serve);
