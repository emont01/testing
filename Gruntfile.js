module.exports=(grunt)=>{
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json')

      , watch:{
            server:{
                files:['server/app.js']
              , tasks:['develop:server']
            }
          , js:{
                files:['client/js/*.js']
              , options:{
                    livereload:35729
                }
            }
          , less:{
                files:['client/less/*.less']
              , options:{
                    livereload:35729
                }
            }
          , pug:{
              files:['client/pug/*.pug']
              , options:{
                    livereload:35729
                }
            }
        }

      , develop:{
            server:{
                file:'server/app.js'
              , nodeArgs:['--harmony']
              , env:{
                    PORT:grunt.option('port')||3000
                  , ENV:'development'
                }
            }
        }

      , mochacli:{
            options:{
                reporter:'spec'
              , harmony:true
              , bail:true
              , timeout:50000
              , env:{
                    ENV:'test'
                }
            }
          , server:['tests/*.js']
        }

      , clean:{
            server:'dist'
        }

      , concurrent:{
            server:[
                'pug:server'
              , 'less:server'
              , 'uglify:server'
              , 'copy:server'
            ]
        }
      , pug:{
            server:{
                options:{
                    pretty:false
                }
              , files:{
                    'dist/index.html'
                  : 'client/pug/prod.pug'
                }
            }
        }
      , less:{
            server:{
                options:{
                    cleancss:true
                  , paths:['bower_components']
                }
              , files:{
                    'dist/css/t1.css'
                  : 'client/less/t1.less'
                }
            }
        }
      , uglify:{
            server:{
                files:[{
                    'dist/js/t1.min.js':[
                        'client/js/t1.js'
                    ]
                }]
            }
        }
      , copy:{
            server:{
                files:[{
                    src:'client/favicon.ico'
                  , dest:'dist/favicon.ico'
                },{
                    expand:true
                  , cwd:'client/png/'
                  , src:['**']
                  , dest:'dist/png/'
                }]
            }
        }
    });

    grunt.registerTask('test',['mochacli:server']);
    grunt.registerTask('build',[
        'clean:server'
      , 'concurrent:server'
    ]);
    grunt.registerTask('serve',[
        'develop:server'
      , 'watch'
    ]);
};

