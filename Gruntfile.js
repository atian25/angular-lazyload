/**
 * 自动化脚本定义
 */
module.exports = function (grunt) {
  'use strict';

  //load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  require('shelljs/global');
  var path = require('path');

  //define tasks
  //启动Web服务器,监控变更,自动加载
  grunt.registerTask('server', ['connect', 'open', 'watch']);


  //读取配置
  var pkg = grunt.file.readJSON('package.json');
  var cfg = {
    pkg: pkg,
    src: './',
    // Change 'localhost' to '0.0.0.0' to access the server from outside.
    serverHost: '0.0.0.0',
    serverPort: 9000,
    serverUrl: 'http://localhost:9000/example/src/index.html',
    livereload: 35729
  };

  //grunt config
  grunt.initConfig({
    //======== 配置相关 ========
    cfg: cfg,

    //======== 开发相关 ========
    //开启服务
    connect: {
      options: {
        port: cfg.serverPort,
        hostname: cfg.serverHost,
        middleware: function(connect, options) {
          return [
            require('connect-livereload')({
              port: cfg.livereload
            }),
            connect.query(),
            // Serve static files.
            connect.static(options.base),
            // Make empty directories browsable.
            connect.directory(options.base),
          ];
        }
      },
      server: {
        options: {
          base: cfg.src
        }
      }
    },

    //监控文件变化
    watch: {
      options: {
        livereload: cfg.livereload,
      },
      server: {
        files: [
          cfg.src + '/**'
        ],
        tasks: []
      }
    }
  });

  /**
   * 在跨域chrome中打开首页
   */
  grunt.registerTask('open', function(crossdomain) {
    var url = cfg.serverUrl || 'http://localhost:' + cfg.serverPort;
    url = url && url.replace(/"/g, '\\\"') || 'about:blank';
    var param = !crossdomain ? '' : ' --user-data-dir=C:/CHROME_DEV  --disable-web-security --allow-file-access-from-files ';
    var cmd = 'start chrome '+ url + ' ' + param;
    exec(cmd);
  });
};
