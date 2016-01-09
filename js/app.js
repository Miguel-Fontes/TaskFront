var app = (function (todo, http, css, dom) {
  
  console.log('Inicializando aplicação!')
  
  return {
    todo: todo.build(css, http, dom)
  }

})(TODO, HTTPREQUEST, CSSTOOLS, DOMTOOLS)
