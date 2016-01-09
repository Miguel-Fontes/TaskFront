describe('DomTools Module', function () {
  // Simples Mock Object
  var mockDoc = (function () {
    return {
      getElementById: id,
      getElementsByTagName: id,
      getElementsByName: id,
      getElementsByClassName: id
    }

    function id (f) { return f }
  })()

  var d = DOMTOOLS.build(mockDoc)

  // Vou validar os tipos dos retornos da API.
  // Validar o retorno das funções será tarefa da validação e2e
  describe('get elements API', function () {
    it('should get element by ID', function () {
      expect(d.byId('#banner')).toBe('#banner')
    })

    it('should get element by TAG', function () {
      expect(d.byTag('li')).toBe('li')
    })

    it('should get element by NAME', function () {
      expect(d.byName('name')).toBe('name')
    })

    it('should get element by CLASS', function () {
      expect(d.byClass('.class')).toBe('.class')
    })

    describe('change dom API', function () {
      it('should change field value', function () {
        // d.attrUpdate(element, attr, value)
      })

      it('should remove a DOM node', function () {
        // d.removeDOMNode(element, targetNode)
      })

    })
  })

})
