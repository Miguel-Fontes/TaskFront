describe('HTTP Request Module', function () {
  describe('Module Factory', function () {
    var http
    beforeAll(function () {
      http = HTTPREQUEST.xhrRequest()
    })
    it('Should be defined since the object should be built with no params if we desired', function () {
      expect(http).toBeDefined
    })
  })
  describe('Shorthand API', function () {
    var http
    beforeAll(function () {
      http = HTTPREQUEST.xhrRequest()
    })

    it('A get request should build with no params', function () {
      expect(http.get).toBeDefined
    })
    it('A get post should build with no params', function () {
      expect(http.post).toBeDefined
    })
    it('A get remove should build with no params', function () {
      expect(http.remove).toBeDefined
    })
    it('A get update should build with no params', function () {
      expect(http.update).toBeDefined
    })

  })
})
