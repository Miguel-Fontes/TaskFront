var MOCKDOMTOOLS = (function () {
  return {
    build: domToolsBuilder
  }

  // BUILDER
  function domToolsBuilder (doc) {
    return new DomTools(doc)
  }

  function DomTools (doc) {
    var md = this

    md.byId = byId
    md.byTag = byTag
    md.byName = byName
    md.byClass = byClass
    md.removeDOMNode = removeDOMNode
    md.updateAttr = updateAttr
    md.createDOMNode = createDOMNode
    md.appendNode = appendNode

    function byId (id) {
      return createDOMNode('li', 'mock!')
    }

    function byTag (id) {
      return createDOMNode(id, 'mock!')
    }

    function byName (id) {
      return createDOMNode(id, 'mock!')
    }

    function byClass (id) {
      return createDOMNode(id, 'mock!')
    }

    function updateAttr (element, attr, value) {
      element[attr] = value
    }

    function createDOMNode (type, content) {
      var node = doc.createElement(type)

      updateAttr(node, 'innerHTML', content || '')

      return node
    }

    function appendNode (parent, child) {
      parent.appendChild(child)
    }

    function removeDOMNode (element, targetNode) {
      var node = element

      while (node.localName != targetNode) {
        node = node.parentNode
        if (node.localName == null) {
          break
        }
      }

      if (node.localName != null) {
        node.remove()
      } else {
        throw ('Nó não existe')
      }
    }

  }
})()
