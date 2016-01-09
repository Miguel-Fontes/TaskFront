var app = (function (todo) {
  
  console.log('Inicializando aplicação!')
  
  return {
    todo: todo.build()
  }

})(TODO)
