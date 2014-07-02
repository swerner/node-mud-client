module.exports = (grunt) ->
  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-contrib-watch')

  grunt.initConfig
    watch:
      coffee:
        files: ['src/*.coffee', 'src/**/*.coffee']
        tasks: ['coffee:compile']

    coffee:
      compile:
        expand: true,
        cwd: "#{__dirname}/src/",
        src: ['**/*.coffee'],
        dest: 'lib/',
        ext: '.js'
