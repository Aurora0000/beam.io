var gulp = require('gulp');
var electron = require('gulp-atom-electron');

gulp.task('package-linux-x64', function() {
	return gulp.src('./**')
		.pipe(electron({ version: '0.30.4', platform: 'linux', arch: 'x64'}))
		.pipe(electron.zfsdest('release/beam-linux-x64.zip'));
});

gulp.task('package-linux', function() {
	return gulp.src('./**')
		.pipe(electron({ version: '0.30.4', platform: 'linux', arch: 'ia32'}))
		.pipe(electron.zfsdest('release/beam-linux-ia32.zip'));
});

gulp.task('package-windows-x64', function() {
	return gulp.src('./**')
		.pipe(electron({ version: '0.30.4', platform: 'win32', arch: 'x64'}))
		.pipe(electron.zfsdest('release/beam-win64.zip'));
});
