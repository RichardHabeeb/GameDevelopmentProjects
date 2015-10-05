module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        browserify: {
            dist: {
                files: {
                    'build/bundle.js': ['js/*.js']
                }
            }
        },
        watch: {
            files: ['js/*.js'],
            tasks: ['browserify']
        },
        copy: {
            main: {
                src: 'node_modules/bootstrap/dist/css/bootstrap.min.css',
                dest: 'build/bootstrap.min.css',
            }
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['browserify', 'copy']);
};
