var gulp = require('gulp');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var watch = require('gulp-watch');
var copy = require('gulp-contrib-copy');
var cssmin = require('gulp-cssmin');
var browserSync = require('browser-sync');
var prefix = require('gulp-autoprefixer');
var cp = require('child_process');
var clean = require('gulp-clean');

var jekyll = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

/**
 * Jekyll编译站点
 */
gulp.task('jekyll-build', function(done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn(jekyll, ['build'], {
            stdio: 'inherit'
        })
        .on('close', done);
});

/**
 *  Jekyll重新加载
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function() {
    browserSync.reload();
});

/**
 * server 服务
 */
gulp.task('browser-sync', ['sass', 'uglify', 'copy', 'jekyll-build'], function() {
    browserSync({
        server: {
            baseDir: '_site'
        }
    });

    gulp.watch(['./docs/**/*.*','js/*.js','scss/*.scss'],['jekyll-rebuild']);
});

/**
 * 按需打包 js
 */
gulp.task('uglify', function() {
    gulp.src([
            'js/intro.js',
            'js/util.js',
            'js/zepto-adapter.js',
            'js/device.js',
            'js/fastclick.js',
            'js/tabs.js',
            'js/modal.js',
            'js/calendar.js',
            'js/picker.js',
            'js/datetime-picker.js',
            'js/iscroll.js',
            'js/scroller.js',
            'js/pull-to-refresh-js-scroll.js',
            'js/pull-to-refresh.js',
            'js/infinite-scroll.js',
            'js/searchbar.js',
            'js/panels.js',
            'js/router.js',
            'js/init.js',
            'js/scroll-fix.js',
            'js/swiper.js',
            'js/swiper-init.js',
            'js/photo-browser.js',
            'js/city-data.js',
            'js/city-picker.js'
        ])
        .pipe(concat('wii.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(gulp.dest('docs/dist/js'))
        .pipe(rename('wii.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(gulp.dest('docs/dist/js'));
});

/**
 * 将 CSS 全部打包
 */
gulp.task('sass', function() {
    return gulp.src('./scss/**/*.scss')
        .pipe(sass())
        .pipe(concat('wii.css'))
        .pipe(gulp.dest('./dist/css'))
        .pipe(gulp.dest('./docs/dist/css'))
        .pipe(cssmin())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist/css'))
        .pipe(gulp.dest('docs/dist/css'));
});

/**
 * 字体文件拷贝
 */
gulp.task('copy', function() {
    gulp.src('./scss/resource/fonts/*')
        .on('error', function(err, file) {
            console.log(err)
        })
        .pipe(copy())
        .on('error', function(err, file) {
            console.log(err)
        })
        .pipe(gulp.dest('./dist/css/resource/fonts/'))
        .pipe(gulp.dest('./docs/dist/css/resource/fonts/'));
});

/**
 * 清理文件
 */
gulp.task('clean', function() {
    return gulp.src(['dist','docs/dist','_site'], {
            read: false
        })
        .pipe(clean());
});

/**
 * 默认任务配置
 */
gulp.task('default', ['browser-sync']);
gulp.task('package', ['sass', 'uglify', 'copy']);
