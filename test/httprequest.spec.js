describe('HTTP Request Module', function () {
  // Task Model para ajudar
  function Task (id, description, status) {
    this.id = id
    this.description = description
    this.done = status
  }
  // Factory Suite
  describe('Module Factory', function () {
    var http
    beforeAll(function () {
      http = HTTPREQUEST.xhrRequest()
    })
    it('Should be defined since the object should be built with no params if we desired', function () {
      expect(http).not.toBe(undefined)
    })
  })

  // Shorthand API Suite
  describe('Shorthand API', function () {
    var http
    beforeAll(function () {
      http = HTTPREQUEST.xhrRequest()
    })

    it('A get method should be available with no params', function () {
      expect(http.get).not.toBe(undefined)
    })
    it('A post method should be available with no params', function () {
      expect(http.post).not.toBe(undefined)
    })
    it('A remove method should be available with no params', function () {
      expect(http.remove).not.toBe(undefined)
    })
    it('A update method should be available with no params', function () {
      expect(http.put).not.toBe(undefined)
    })

    describe('connectivity tests', function () {
      var task = new Task('999', 'Tarefa teste Jasmine', false)

      it('Should send a get request', function (done) {
        http.get('http://localhost:8080/tasks', function (data) {
          expect(data).not.toBe(undefined)
          console.log(data)
          done()
        })
      })

      it('should send a task via post', function (done) {
        http.post('http://localhost:8080/tasks', JSON.stringify(task), function (data) {
          http.remove('http://localhost:8080/tasks/999', function (data) {
            expect(data).toBe('Remover tarefa')
            console.log(data)
            done()
          })
        })
      })
    })

  })
})
