var app = (function (todo, http, css, dom, utils) {
  
  console.log('Inicializando aplicação!')
  
  return {
    todo: todo.build(css, http, dom, utils)
  }

})(TODO, HTTPREQUEST, CSSTOOLS, DOMTOOLS, UTILS)
