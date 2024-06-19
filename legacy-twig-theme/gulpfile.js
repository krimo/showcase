const { series, parallel, src, dest, watch } = require('gulp');
const bs = require('browser-sync').create();
const postcss = require('gulp-postcss');
const sass = require('gulp-sass')(require('dart-sass'));
const concat = require('gulp-concat');
const autoprefixer = require('autoprefixer');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');

sass.compiler = require('dart-sass');

const jsFiles = [
	'assets/js/vendors/es6-promise-auto.min.js',
	'assets/js/vendors/jquery-3.2.1.min.js',
	'assets/js/vendors/BoxSdk.min.js',
	'assets/js/vendors/sha1.min.js',
	'assets/js/vendors/jquery.easing.js',
	'assets/js/vendors/dropzone.min.js',
	'assets/js/vendors/isotope.min.js',
	'assets/js/vendors/greensock/TimelineMax.min.js',
	'assets/js/vendors/greensock/TweenMax.min.js',
	'assets/js/vendors/greensock/plugins/ScrollToPlugin.min.js',
	'assets/js/vendors/scrollmagic/ScrollMagic.min.js',
	'assets/js/vendors/scrollmagic/plugins/debug.addIndicators.min.js',
	'assets/js/vendors/scrollmagic/plugins/animation.gsap.min.js',
	'assets/js/vendors/js.cookie.js',
	'assets/js/vendors/swiper.min.js',
	'assets/js/vendors/navigo.min.js',
	'assets/js/vendors/twig.min.js',
	'assets/js/twig-templates.js',
	'assets/js/twig-functions.js',
	'assets/js/modules/*.js',
	'assets/js/modules/reinit/*.js',
	'modules/*/*.js',
	'templates/*/*.js',
	'assets/js/main.js',
];

function css() {
	return src(['assets/scss/styles.scss', 'templates/*/*.scss', 'modules/*/*.scss'])
		.pipe(concat('styles.min.css'))
		.pipe(
			sass({
			
				outputStyle: 'compressed',
				includePaths: ['./assets/scss'],
			}).on('error', sass.logError)
		)
		.pipe(postcss([autoprefixer()]))
		.pipe(dest('./assets/css'))
		.pipe(bs.stream());
}

function admin_css() {
	return src(['assets/scss/admin.scss'])
		.pipe(concat('admin.min.css'))
		.pipe(
			sass({
			
				outputStyle: 'compressed',
				includePaths: ['./assets/scss'],
			}).on('error', sass.logError)
		)
		.pipe(postcss([autoprefixer()]))
		.pipe(dest('./assets/css'))
		.pipe(bs.stream());
}

function js() {
	return src(jsFiles).pipe(concat('scripts.min.js')).pipe(uglify()).pipe(dest('assets/js/dist')).pipe(bs.stream());
}

function serve(cb) {
	bs.init({
		proxy: 'https://remedystaging.test',
	});

	watch(['assets/js/*.js', 'assets/js/modules/*.js', 'templates/*/*.js', 'modules/*/*.js'], parallel(js));
	watch(['assets/scss/*.scss', 'modules/*/*.scss', 'templates/*/*.scss'], parallel(css, admin_css));
	watch(['*.php', 'includes/*.php', 'modules/*/*.php', 'templates/*/*.php', '*.twig', 'modules/*/*.twig', 'templates/*/*.twig']).on(
		'change',
		bs.reload
	);

	cb();
}
exports.default = series(parallel(css, js), serve);
