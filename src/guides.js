;guides = (function(){
  "use strict";

  var _rulers
    , _guides
    , _root
    , _shadow;

  var init = function() {

    _rulers = [{ h: { x:0, y:0 } }, { v: { x:0, y:0 } }];
    _guides = [{ x:0, y:0 }, { x:0, y:0 }];

    _root = document.createElement('div');
    _root.setAttribute('id', '#guides');
    document.body.appendChild(_root);
    _shadow = _root.webkitCreateShadowRoot();
  }

  var inject = function(){
    console.log('guides inject');
    /* inject guides into the dom, this function
    id used by the node processes on the server side */
  }

  var injectStyle = function(){
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
          'opacity: .3;' +
          'background-color: red;' +
          'cursor: pointer;' +
        '}' +
        '.h-ruler' +
          'position: absolute;' +
          'width: 100%;' +
          'opacity: .3;' +
          'background-color: blue;' +
        '}' +
      '</style>';
  }

  var render = function(){
    console.log('guides render');
    injectStyle();

    for (var i = _rulers.length - 1; i >= 0; i--) {
      var ruler = document.createElement('div');
      ruler.setAttribute('class', 'v-ruler');
      _shadow.appendChild(ruler);
    };
  };

  var clear = function(){
    console.log('guides clear');
  };

  var lock = function(){
    console.log('guides lock');
  };

  var save = function(){
    console.log('guides save');
  };

  var show = function(){

  };

  var hide = function(){

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