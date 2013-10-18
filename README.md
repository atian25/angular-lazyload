## angular-sea

通过seajs动态加载angular模块。

### 安装
- 通过bower安装: `bower install angular-sea`
- 通过源码安装: 复制`dist`下对于的js即可

### 如何使用

**具体参考源码**

1.步骤一: 通过seajs加载angular-sea, 并手动启动bootstrap

```
  seajs.use(['../../src/angular-sea', 'app'], function(ngSea, app){
    angular.bootstrap(document, ['app']);
  });
```

2.步骤二: 引入`angular-sea`作为主项目的依赖

```
  //app.js
  var app = angular.module('app', ['angular-sea', 'ngRoute']);
```

3.步骤三: 配置事件名 (可选), 支持ui-route, 修改事件名为`$stateChangeStart`即可
```
  //app.js
  seaProvider.init('$routeChangeStart');
```

4.步骤四: 保留provider的注册引用
```
  //app.js
  app.register = seaProvider.register;
```

5.路由映射, 添加`controllerUrl`
```
  //app.js
  $routeProvider
    .when('/test/a', {
      controller: 'testACtrl',
      controllerUrl: 'modules/module1/testACtrl.js',
      templateUrl: 'modules/module1/testA.tpl.html'
    })
  }
```

6.动态注册, 通过`app.register`注册controller
```
  //testACtrl.js
  app.register.controller('testACtrl', ['$scope', '$routeParams', '$location', '$http',
    function($scope, $routeParams, $location, $http){
    }]
  );
```

### 基本原理

 - 通过`route`的`resolve`做hack点
 - 在`config`期保存`register`的引用
 - 监听`$routeChangeStart`事件, 动态添加一个`resolve`
 - `resolve`里面通过seajs去动态加载模块,并动态注册

### TODO
- 添加测试的示例, 参考https://github.com/seajs/seajs/issues/874
- 欢迎贡献代码

### 项目示例初始化说明

1. 安装[nodejs](http://nodejs.org) -- 下载对应版本并安装
2. 安装[grunt](http://gruntjs.com) -- 命令行下执行: `npm install -g grunt-cli`  (不包含符号` ,下同)
3. 安装[bower](https://github.com/bower/bower) -- 命令行下执行: `npm install -g bower`  (不包含符号` ,下同)
4. 安装依赖库 -- 命令行到项目根目录,执行 `npm install` 
5. 安装Web类库 --  命令行到**example**目录,执行 `bower install`
6. 运行示例 -- 命令行执行 `grunt server`, 将自动打开浏览器显示首页


