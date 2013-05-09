;guides = (function () {
  "use strict";

  var _visible, _mouse, _vIndicator, _hIndicator, _rulers, _guides, _root, _shadow;
  var TYPE_RULER_H = "horizontal";
  var TYPE_RULER_V = "vertical";
  var SIZE_RULER = 10;
  var options = {};
  options.RenderText = false;

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
    window.onresize = handleResize;
    window.onmousemove = trackMouse;
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
    }
    else {
      hide();
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
        '.mouse {' +
          'position: absolute;' +
          'top: 0px' +
          'left: 0px' + 
          'width: 100px;' +
          'height: 30px' +
          'z-index: 3000;' +
          'font-size: .5em;' +
          'opacity: 0;' +
          'background-color: transparent;' +
        '}' +
        '.vIndicator {' +
          'position: absolute;' +
          'left: 0px;' +
          'width: ' + SIZE_RULER + 'px;' +
          'height: 1px;' +
          'opacity: 0;' +
          'background-color: red;' +
          'z-index: 3001;' +
        '}' +
        '.vertical-ruler {' +
          'position: absolute;' +
          'width: ' + SIZE_RULER + 'px;' +
          'height: 100%;' +
          'top: 0px;' +
          'left: 0px;' +
          'z-index: 3000;' +
          'opacity: 0;' +
          'background-color: rgba(255,255,255, 0.5);' +
          'border-right: 1px solid black;' +
          'cursor: pointer;' +
        '}' +
        '.hIndicator {' +
          'position: absolute;' +
          'top: 0px;' +
          'height: ' + SIZE_RULER + 'px;' +
          'width: 1px;' +
          'opacity: 0;' +
          'background-color: red;' +
          'z-index: 3001;' +
        '}' +
        '.horizontal-ruler {' +
          'position: absolute;' +
          'top: 0px;' +
          'left: 0px;' +
          'height: ' + SIZE_RULER + 'px;' +
          'width: 100%;' +
          'opacity: 0;' +
          'background-color: rgba(255,255,255, 0.5);' +
          'border-bottom: 1px solid black;' +
          'cursor: pointer;' +
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
    _shadow.innerHTML = '';

    injectStyle();

    _vIndicator = document.createElement('div');
    _vIndicator.setAttribute('class','vIndicator guides');
    _shadow.appendChild(_vIndicator);

    _hIndicator = document.createElement('div');
    _hIndicator.setAttribute('class','hIndicator guides');
    _shadow.appendChild(_hIndicator);


    // add mouse cord indicator
    _mouse = document.createElement('div');
    _mouse.setAttribute('class','mouse guides');
    _mouse.innerHTML = "Hello";
    _shadow.appendChild(_mouse);

    for (var i = _rulers.length - 1; i >= 0; i--) {
      var ruler = document.createElement('canvas');
      ruler.setAttribute('class', _rulers[i] + '-ruler guides');
      _shadow.appendChild(ruler);
      renderRuler(ruler, _rulers[i])
    }
  };

  var renderRuler = function(canvas, type) {
    var context = canvas.getContext('2d');

    // set height width
    canvas.width = (type === TYPE_RULER_V) ? SIZE_RULER : window.innerWidth;
    canvas.height = (type === TYPE_RULER_H) ? SIZE_RULER : window.innerHeight;
    // setup the line style
    context.strokeStyle = '#000';
    context.lineWidth = 1;
    // anti-alias hack
    context.translate(0.5, 0.5)

    var x = SIZE_RULER;
    var y = SIZE_RULER;
    var count = (type === TYPE_RULER_V) ? Math.floor(window.innerHeight/10) : Math.floor(window.innerWidth/10);

    for (var i = count - 1; i >= 0; i--) {
      var offset = Math.floor(SIZE_RULER/2);
      if(i%2 == 0) {
        offset = Math.floor(offset/4);
      }
      // render text
      if(options.RenderText){
        if(i == 0 || i%5 == 0) {
          if(type === TYPE_RULER_H) {
            context.fillText(x, x, 10);
          }
          else {
            context.fillText(y, 2, y+4);
          }
        }
      }
      context.beginPath();
        if(type === TYPE_RULER_H) {
          context.moveTo(x+=10,offset);
          context.lineTo(x, y+10);
        }
        else{
          context.moveTo(offset,y+=10);
          context.lineTo(x+10, y);
        }
      context.closePath();
      context.stroke();
    };
  }

  var handleResize = function() {
    console.log('resize');
    render();
    toggleVisiblity();
  }

  var trackMouse = function(event) {
    _mouse.style.left = (event.clientX + 10)  + "px";
    _mouse.style.top = (event.clientY - 5)  + "px";
    _mouse.innerHTML = 'x:' + event.clientX + ' y:' + event.clientY;

    _vIndicator.style.top = event.clientY  + "px";
    _hIndicator.style.left = event.clientX  + "px";

  }

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
    _visible = true;
  };

  var hide = function () {
    console.log('guides hide');
    removeClass(_shadow.getElementsByClassName('guides'), 'show');
    _visible = false;
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