# angular-sea 

#### 通过[Sea.js](http://seajs.org/)动态按需加载[AngularJS](http://angularjs.org) 模块。

---
**[下载](dist/angular-sea.js)** (or **[压缩版](dist/angular-sea.min.js)**) **|**
**[使用指南](#使用指南) |**
**[基本原理](#基本原理) |**
**[TODO/贡献代码](#TODO) |**
**[示例使用说明](#示例使用说明)**

---


### 使用指南

**(1)** 安装
- 通过[Bower](http://bower.io/)安装: `bower install angular-sea`
- 直接下载: [Download](dist/angular-sea.js) (or [Minified](dist/angular-sea.min.js))

**(2)** 在你的`index.html`中先引入`angular.js`和`sea.js`。

**(3)** 通过`seajs`加载`angular-sea`, 并手动启动bootstrap。
```
  //修改`../../src/angular-sea`为`angular-sea`的存放路径, app为你的主模块文件`app.js` 
  seajs.use(['../../src/angular-sea', 'app'], function(ngSea, app){
    angular.bootstrap(document, ['app']);
  });
```

**(3)** 添加`angular-sea`为你的主模块的依赖中。
```
  //app.js
  var app = angular.module('app', ['angular-sea', 'ngRoute']);
```

**(4)** 在`app.run`里进行初始化。
```
  //app.js
  app.run(['$sea', function($sea){
    $sea.init(app);
    //两个参数均为可选, 支持ui-route, 修改事件名为`$stateChangeStart`即可
    //$sea.init(app, '$routeChangeStart');
  }]);
```

**(5)** 路由映射, 添加`controllerUrl`
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

**(6)** 在你的模块里进行注册controller。
```
  //testACtrl.js
  //通过`app.register`来注册
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


