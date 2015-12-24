// Módulo CSS - Removido do Módulo TODO Para limpar o código. 
// Este módulo é uma dependência do TODO, portanto, deve ser carregado primeiro.
var CSSTOOLS = (function () {
  return {
    addClass: addClass,
    removeClass: removeClass,
    toggleClass: toggleClass
  }

  function addClass (element, cssClass) {
    if (!element.classList.contains(cssClass)) {
      element.classList.add(cssClass)
    }
  }

  function removeClass (element, cssClass) {
    if (element.classList.contains(cssClass)) {
      element.classList.remove(cssClass)
    }
  }

  function toggleClass (element, cssClass) {
    if (element.classList.contains(cssClass)) {
      removeClass(element, cssClass)
    } else {
      addClass(element, cssClass)
    }
  }

})();