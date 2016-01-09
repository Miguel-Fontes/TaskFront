describe('todo list app', function () {
  it('should add a todo', function () {
    browser.get('http://localhost:8000/')

    var input = element(by.id('taskInput'))
    input.sendKeys('Tarefa Teste Protractor')
    
  })
})
