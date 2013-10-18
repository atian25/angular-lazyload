## 源码目录

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