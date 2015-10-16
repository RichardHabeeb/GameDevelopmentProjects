module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        browserify: {
            dist: {
                files: {
                    'client/public/bundle.js': ['client/js/*.js', 'messages/*.js'],
                }
            }
        },
        uglify: {
            my_target: {
                files: {
                    'client/public/bundle.min.js': ['client/public/bundle.js'],
                }
            }
        },
        watch: {
            files: ['client/js/*.js', 'messages/*.js'],
            tasks: ['browserify']
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['browserify', 'uglify']);
};
