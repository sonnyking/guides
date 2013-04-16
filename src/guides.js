;guides = (function () {
  "use strict";

  var _visible, _rulers, _guides, _root, _shadow;

  var init = function () {
    _visible = false;
    _rulers = ["horizontal","vertical"];
    _guides = [{ x: 0, y: 0 }, { x: 0, y: 0 }];

    _root = document.createElement('div');
    _root.setAttribute('id', 'guides');
    document.body.appendChild(_root);
    _shadow = _root.webkitCreateShadowRoot();
    // event listeners
    document.addEventListener('keydown', keystrokeHandler);
    render();
  };

  var keystrokeHandler = function (event) {
    // console.log("key press: " + event.keyCode);
    if(event.keyCode === 82) {
      toggleVisiblity();
    }
  };

  var toggleVisiblity = function () {
    if(_visible === false) {
      show();
      _visible = true;
    }
    else {
      hide();
      _visible = false;
    }
  };

  var inject = function () {
    console.log('guides inject');
    /* inject guides into the dom, this function
    id used by the node processes on the server side */
  };

  var injectStyle = function () {
    _shadow.innerHTML = 
      '<style>' +
        '.guide {' +
          'position: absolute;' +
          'width: 1px;' +
          'background-color: blue;' +
        '}' +
        '.v-ruler {' +
          'position: absolute;' +
          'width: 10px;' +
          'height: 100%;' +
          'top: 0px;' +
          'left: 0px;' +
          'z-index: 3000;' +
          'opacity: 0;' +
          'background-color: red;' +
          'cursor: pointer;' +
        '}' +
        '.h-ruler {' +
          'position: absolute;' +
          'width: 100%;' +
          'opacity: .3;' +
          'background-color: blue;' +
        '}' +
        '.show {' +
          'display: block;' +
          'opacity: 1;' +
        '}' +
        '#guides {' +
          'position: absolute;' +
          'top: 0px;' +
          'left: 0px' +
          'width: 40px' +
          'height: 100%' +
          'background-color: blue;' +
          'opacity: 1;' +
          'transition: opacity 2s;' +
        '}' +
      '</style>';
  };

  var render = function () {
    console.log('guides render');
    injectStyle();

    for (var i = _rulers.length - 1; i >= 0; i--) {
      var ruler = document.createElement('div');
      ruler.setAttribute('class', 'v-ruler guides');
      _shadow.appendChild(ruler);
    }
  };

  var clear = function () {
    console.log('guides clear');
  };

  var lock = function () {
    console.log('guides lock');
  };

  var save = function () {
    console.log('guides save');
  };

  var show = function () {
    console.log('guides show');
    addClass(_shadow.getElementsByClassName('guides'), 'show');
  };

  var hide = function () {
    console.log('guides hide');
    removeClass(_shadow.getElementsByClassName('guides'), 'show');
  };


  var addClass = function (list, className) {
    for (var i = list.length - 1; i >= 0; i--) {
      list[i].classList.add(className);
    }
  };

  var removeClass = function (list, className) {
    for (var i = list.length - 1; i >= 0; i--) {
      list[i].classList.remove(className);
    }
  };

  init();

  return {
    render: render,
    clear: clear,
    lock: lock,
    save: save,
    show: show,
    hide: hide
  };

})()