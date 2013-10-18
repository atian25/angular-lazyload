## angular + seajs 示例

### 项目初始化说明

1. 安装[nodejs](http://nodejs.org) -- 下载对应版本并安装
2. 安装[grunt](http://gruntjs.com) -- 命令行下执行: `npm install -g grunt-cli`  (不包含符号` ,下同)
3. 安装[bower](https://github.com/bower/bower) -- 命令行下执行: `npm install -g bower`  (不包含符号` ,下同)
4. 安装依赖库 -- 命令行到项目根目录,执行 `npm install` 和 `bower install`

### 开发说明

1. 命令行执行 `grunt server`
2. 将启动内置web服务, 监控src目录
3. 将自动打开浏览器显示首页


### 目录说明

- src
  - images  图片
  - css     样式
  - modules 本项目用到的模块, 按模块划分
    - module1 具体某个模块
      - module1.js       模块用到的js
      - module1.spec.js  对应的单元测试
      - module1.tpl.html 模板文件
    - module2
      - ...
  - commons 存储我们的通用模块,后期再独立为component
  - components 存储第三方的web类库,通过bower来安装,不存储到源码库.
  - conf  配置文件
    - urlmapping.conf  路由映射
- prototype 存储R.E.D提供的原始HTML+CSS
- test 存储测试相关的一些数据和脚本
- Gruntfile.js 脚本定义
- package.json 自述文件,版本号等信息
- bower.json 定义需要安装到src/components的第三方web类库
- node_modules 开发期需用到的nodejs插件, 无需纳入源码管理, 通过`npm install`安装.
