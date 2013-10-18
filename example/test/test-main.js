var alias = {};
for (var file in window.__karma__.files) {
  if (window.__karma__.files.hasOwnProperty(file)) {
    if (/\/src\//.test(file)) {
      var name = file.replace(/^\/base\/src/, '.').replace(/\.js$/, '');
      console.log('>',name, file)
      alias[name] = file;
    }
  }
}

seajs.config({
  base: './',
  alias: alias
})

var _fn = window.__karma__.start;
window.__karma__.start  = function() {
  seajs.use([
    './app',
    './modules/module2/testBCtrl.spec'
  ], function(m) {
    angular.bootstrap(document, ['app']);
    _fn.call()
  })
}