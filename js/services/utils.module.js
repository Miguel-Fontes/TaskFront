'use strict'
var UTILS = (function () {
  return new Utils()

  function Utils () {
    // DECLARATIONS
    let md = this
    
    // API
    md.isType = isType

    // FUNCTIONS
    function isType (obj, type) {
      var clas = Object.prototype.toString.call(obj).slice(8, -1)
      return obj !== undefined && obj !== null && clas === type
    }

  }

})()
