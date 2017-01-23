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
              , 'cssmin:server'
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
                    'dist/client/t1.css'
                  : 'client/less/t1.less'
                }
            }
        }
      , uglify:{
            server:{
                files:[{
                    'dist/notifier/client/js/jquery.min.js':[
                        'bower_components/jquery/dist/jquery.min.js'
                    ]
                },{
                    'dist/notifier/client/js/socket.io.min.js':[
                        'bower_components/socket.io-client/socket.io.js'
                    ]
                },{
                    'dist/notifier/client/js/notifier.min.js':[
                        'client/js/worker.js'
                    ]
                }]
            }
        }
      , copy:{
            server:{
                files:[{
                    src:'client/favicon.ico'
                  , dest:'dist/notifier/client/favicon.ico'
                },{
                    expand:true
                  , src:['core/*.js']
                  , dest:'dist/notifier/'
                },{
                    src:'server/notifier.io.js'
                  , dest:'dist/notifier/server/notifier.io.js'
                },{
                    src:'config/notifier.js'
                  , dest:'dist/notifier/config/notifier.js'
                },{
                    src:'package/notifier.json'
                  , dest:'dist/notifier/package.json'
                }]
            }
        }
      , cssmin:{
            server:{
                files:{
                    'dist/master/client/style.css':[
                        'dist/master/client/style.css'
                      , 'bower_components/angular-resizable/'
                            +'angular-resizable.min.css'
                      , 'bower_components/foundation-datepicker/css/'
                            +'foundation-datepicker.min.css'
                    ]
                }
            }
        }
    });

    grunt.registerTask('test',['mochacli:server']);
    grunt.registerTask('build',[
        'clean:server'
      , 'concurrent:server'
      , 'cssmin:server'
    ]);
    grunt.registerTask('serve',[
        'develop:server'
      , 'watch'
    ]);
};

