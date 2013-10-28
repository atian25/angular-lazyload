# angular-lazyload

#### a lazyload service for angular projects, only load-on-demand, support seajs/requirejs/custom.
### 按需加载[AngularJS](http://angularjs.org)模块, 支持[Sea.js](http://seajs.org/)和[RequireJS](http://requirejs.org/‎)。

---
**[下载](dist/angular-lazyload.js)** (or **[压缩版](dist/angular-lazyload.min.js)**) **|**
**[使用指南](#使用指南) |**
**[基本原理](#基本原理) |**
**[TODO/贡献代码](#TODO) |**
**[示例使用说明](#示例使用说明)**

---


### 使用指南

**(1)** 安装
- 通过[Bower](http://bower.io/)安装: `bower install angular-lazyload`
- 直接下载: [Download](dist/angular-lazyload.js) (or [Minified](dist/angular-lazyload.min.js))

**(2)** 在你的`index.html`中引入`angular-lazyload`。
```
  <!-- 实际项目中用bower安装到本地 -->
  <script src="components/seajs/sea.js" id="seajsnode"></script>
  <script src="components/angular/angular.js"></script>
  <script src="components/angular-route/angular-route.js"></script>
  
  <!-- Step1: include js -->
  <script src="../../src/angular-lazyload.js"></script>
```

**(3)** 在你的启动文件里面, 手动启动bootstrap。
```
  //Step2: bootstrap youself
  seajs.use(['app'], function(app){
    angular.bootstrap(document, ['app']);
  });
```

**(3)** 添加`angular-lazyload`为你的主模块的依赖中。
```
  //Step3: add 'angular-lazyload' to your main module's list of dependencies
  var app = angular.module('app', ['angular-lazyload', 'ngRoute']);
```

**(4)** 在`app.run`里进行初始化。
```
  app.run(['$lazyload', function($lazyload){
    //Step5: init lazyload & hold refs
    $lazyload.init(app);
    app.register = $lazyload.register;
  }]);
```

**(5)** 路由映射, 添加`controllerUrl`
```
  //Step4: add `controllerUrl` to your route item config
  $routeProvider
    .when('/test/a', {
      controller: 'testACtrl',
      controllerUrl: 'modules/module1/testACtrl.js',
      templateUrl: 'modules/module1/testA.tpl.html'
    })
  }
```

**(6)** 在你的模块里进行注册controller。
```
  //Step6: use `app.register` to register controller/service/directive/filter
  app.register.controller('testACtrl', ['$scope', function($scope){
    ...
  }]);
```


### 基本原理

 - 通过`route`的`resolve`做hack点
 - 在`config`期保存`register`的引用
 - 监听`$routeChangeStart`事件, 动态添加一个`resolve`
 - `resolve`里面通过seajs去动态加载模块,并动态注册

### TODO
- 添加测试的示例, 参考https://github.com/seajs/seajs/issues/874
- 欢迎PullRequest贡献代码

### 示例使用说明

1. 安装[nodejs](http://nodejs.org) -- 下载对应版本并安装
2. 安装[grunt](http://gruntjs.com) -- 命令行下执行: `npm install -g grunt-cli`  (不包含符号` ,下同)
3. 安装[bower](https://github.com/bower/bower) -- 命令行下执行: `npm install -g bower`  (不包含符号` ,下同)
4. 安装依赖库 -- 命令行到项目根目录,执行 `npm install` 
5. 安装Web类库 --  命令行到**example**目录,执行 `bower install`
6. 运行示例 -- 命令行执行 `grunt server`, 将自动打开浏览器显示首页
7. 若参与开发则 -- 命令行执行 `grunt dev`, 欢迎通过PullRequest贡献代码 


