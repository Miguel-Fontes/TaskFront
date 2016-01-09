var DOMTOOLS = (function (utils) {
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
    md.removeNode = removeNode
    md.updateAttr = updateAttr
    md.createNode = createNode
    md.appendNode = appendNode
    md.findParentElement = findParentElement
    md.findChildById = findChildById
    md.getElementFromEvent = getElementFromEvent

     function byId (id) {
      return doc.getElementById(id)
    }

    function byTag (id) {
      return doc.getElementsByTagName(id)
    }

    function byName (id) {
      return doc.getElementsByName(id)
    }

    function byClass (id) {
      return doc.getElementsByClassName(id)
    }

    function updateAttr (element, attr, value) {
      element[attr] = value
    }

    function createNode (type, content) {
      var node = doc.createElement(type)

      updateAttr(node, 'innerHTML', content || '')

      return node
    }

   function appendNode (parent, child) {
      parent.appendChild(child)
    }

    function removeNode (element) {
      element.remove()
    }

    // ---------------TODO: MELHORAR ESSE KCT---------------------
    function findChildById (element, id) {
      var node = element.firstChild

      while (node.id != id) {
        node = node.nextSibling
        if (node.localName == null) {
          break
        }
      }

      if (node.localName != null) {
        return node
      } else {
        throw ('Nó não existe')
      }
    }
    //---------------------------------------------------------------

    function findParentElement (element, targetNode) {
      var node = element

      while (node.localName != targetNode) {
        node = node.parentNode
        if (node.localName == null) {
          break
        }
      }

      if (node.localName != null) {
        return node
      } else {
        throw ('Nó não existe')
      }
    }

    function getElementFromEvent (e) {
      if (utils.isType(e, 'MouseEvent')) {
        return e.target
      } else {
        return e
      }
    }

  }
})(UTILS)
