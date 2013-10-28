define(function (require, exports, module) {
  "use strict";
  module.exports = function(app){
    app.factory('sharedService', function(){
      return {
        test: function(){
          console.log('loaded service')
        }
      }
    })
  }
});