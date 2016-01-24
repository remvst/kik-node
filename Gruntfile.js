module.exports = function(grunt) {
    const SOURCES = ['index.js', 'lib/**/*.js'];
    const TEST_SOURCES = ['test/**/*.js'];

    grunt.initConfig({
        jsdoc: {
            dist: {
                src: SOURCES,
                options: {
                    destination: 'doc'
                }
            }
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint']
        },
        jshint: {
            options: {
                node: true,
                esversion: 6,
                globals: {
                    'after': true,
                    'afterEach': true,
                    'before': true,
                    'beforeEach': true,
                    'describe': true,
                    'it': true
                }
            },
            uses_defaults: SOURCES.concat(TEST_SOURCES)
        },
        mocha_istanbul: {
            coverage: {
                options: {
                    reporter: 'spec',
                    captureFile: 'results.txt',
                    quiet: false,
                    clearRequireCache: false
                },
                src: TEST_SOURCES
            }
        },
        jscs: {
            src: SOURCES,
            options: {
                config: '.jscsrc',
                esnext: true,
                verbose: true,
                fix: false,
                force: true,
                requireCurlyBraces: [
                    'if', 'for', 'while'
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-jscs');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-istanbul');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['jshint', 'jscs', 'mocha_istanbul', 'jsdoc']);
};
