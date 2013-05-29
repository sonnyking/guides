;guides = (function () {
  "use strict";

  var _visible
    , _mouse
    , _vIndicator
    , _hIndicator
    , _rulers
    , _guides
    , _keys
    , _currentGuide
    , _root
    , _shadow;

  var TYPE_RULER_H = "horizontal";
  var TYPE_RULER_V = "vertical";
  var TYPE_GUIDE_H = "horizontal";
  var TYPE_GUIDE_V = "vertical";
  var SIZE_RULER = 10;
  var KEY_ONE = 82;
  var KEY_TWO = 71;

  var options = {};
  options.RenderText = false;

  var _currentPosition = { x: 0, y: 0 };


  var init = function () {
    _visible = false;
    _rulers = ["horizontal","vertical"];
    _guides = new Array();
    _keys = {};

    _root = document.createElement('div');
    _root.setAttribute('id', 'guides');
    document.body.appendChild(_root);
    _shadow = _root.webkitCreateShadowRoot();

    // event listeners
    document.addEventListener('keydown', keydownHandler);
    document.addEventListener('keyup', keyupHandler);
    window.onresize = handleResize;
    window.onmousemove = trackMouse;
    window.onmousedown = handleClick;
    window.onmouseup = place;
    render();
  };

  var keydownHandler = function (event) {
    if(event.keyCode === KEY_ONE || event.keyCode === KEY_TWO) {
      _keys['' + event.keyCode] = true;
      if(_keys['' + KEY_ONE] && _keys['' + KEY_TWO]) {
        toggleVisiblity();
      }
    }
  };

  var keyupHandler = function (event) {
    if(event.keyCode === KEY_ONE || event.keyCode === KEY_TWO) {
      _keys['' + event.keyCode] = undefined;
    }
  }

  var toggleVisiblity = function () {
    if(_visible === false) {
      show();
    }
    else {
      hide();
    }
  };

  var inject = function () {
    /* inject guides into the dom, this function
    id used by the node processes on the server side */
  };

  var injectStyle = function () {
    _shadow.innerHTML = 
      '<style>' +
        '.' + TYPE_GUIDE_H + '-guide {' +
          'position: absolute;' +
          'top: ' + SIZE_RULER + 'px;' +
          'left: ' + SIZE_RULER + 'px;' +
          'width: 100%;' +
          'height: 1px;' +
          'background-color: #05F7F3;' +
          'color: red;' +
          'opacity: 0;' +
          'visibility: hidden;' +
          'cursor: row-resize;' +
        '}' +
        '.' + TYPE_GUIDE_V + '-guide {' +
          'position: absolute;' +
          'top: ' + SIZE_RULER + 'px;' +
          'left: ' + SIZE_RULER + 'px;' +
          'width: 1px;' +
          'height: 100%;' +
          'background-color: #05F7F3;' +
          'color: red;' +
          'opacity: 0;' +
          'visibility: hidden;' +
          'cursor: col-resize;' +
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
          'visibility: hidden;' +
          'background-color: transparent;' +
        '}' +
        '.vIndicator {' +
          'position: absolute;' +
          'left: 0px;' +
          'width: ' + SIZE_RULER + 'px;' +
          'height: 1px;' +
          'opacity: 0;' +
          'visibility: hidden;' +
          'background-color: red;' +
          'z-index: 3001;' +
          'cursor: pointer;' +
        '}' +
        '.vertical-ruler {' +
          'position: absolute;' +
          'width: ' + SIZE_RULER + 'px;' +
          'top: 0px;' +
          'left: 0px;' +
          'z-index: 3000;' +
          'opacity: 0;' +
          'visibility: hidden;' +
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
          'visibility: hidden;' +
          'background-color: red;' +
          'z-index: 3001;' +
          'cursor: pointer;' +
        '}' +
        '.horizontal-ruler {' +
          'position: absolute;' +
          'top: 0px;' +
          'left: 0px;' +
          'height: ' + SIZE_RULER + 'px;' +
          'opacity: 0;' +
          'visibility: hidden;' +
          'background-color: rgba(255,255,255, 0.5);' +
          'border-bottom: 1px solid black;' +
          'cursor: pointer;' +
        '}' +
        '.show {' +
          'display: block;' +
          'opacity: 1;' +
          'visibility: visible;' +
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
        '#guides * {' +
          '-webkit-touch-callout: none;' +
          '-webkit-user-select: none;' +
          '-khtml-user-select: none;' +
          '-moz-user-select: none;' +
          '-ms-user-select: none;' +
          'user-select: none;' +
        '}' +
      '</style>';
  };

  var render = function () {
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
    _shadow.appendChild(_mouse);

    renderRulers();

    disableDraggingFor(document.getElementById("guides"));
  };

  var renderRulers = function () {
    removeRulers();
    for (var i = _rulers.length - 1; i >= 0; i--) {
      var ruler = document.createElement('canvas');
      ruler.setAttribute('class', _rulers[i] + '-ruler guides');
      ruler.setAttribute('id', _rulers[i] + 'Ruler');
      if(_visible){
        addClass([ruler], 'show');
      }
      _shadow.appendChild(ruler);
      renderRuler(ruler, _rulers[i]);
    }
  }

  var removeRulers = function () {
    for (var i = _rulers.length - 1; i >= 0; i--) {
      var ruler = _shadow.getElementById(_rulers[i] + 'Ruler');
      if(ruler != null) {
        _shadow.removeChild(ruler);
      }
    }
  }

  var renderRuler = function (canvas, type) {
    var context = canvas.getContext('2d');

    // set height width
    canvas.width = (type === TYPE_RULER_V) ? SIZE_RULER : window.innerWidth;
    canvas.height = (type === TYPE_RULER_H) ? SIZE_RULER : window.innerHeight;
    // setup the line style
    context.strokeStyle = '#000';
    context.lineWidth = 1;
    // anti-alias hack
    context.translate(0.5, 0.5);

    var x = SIZE_RULER;
    var y = SIZE_RULER;
    var count = (type === TYPE_RULER_V) ? Math.floor(window.innerHeight/10) : Math.floor(window.innerWidth/10);

    for (var i = 0; i < count; i++) {
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
    renderRulers();
  }

  var trackMouse = function(event) {
    _currentPosition.x = event.clientX;
    _currentPosition.y = event.clientY;

    _mouse.style.left = (event.clientX + 10)  + "px";
    _mouse.style.top = (event.clientY - 5)  + "px";
    _mouse.innerHTML = 'x:' + event.clientX + ' y:' + event.clientY;

    _vIndicator.style.top = event.clientY  + "px";
    _hIndicator.style.left = event.clientX  + "px";

    if(typeof _currentGuide != "undefined") {
      if(_currentGuide.type === TYPE_GUIDE_H){
        _currentGuide.element.style.top = event.clientY + "px";
      }
      else {
        _currentGuide.element.style.left = event.clientX + "px";
      }
    }

  }

  // guide methods

  var handleClick = function (event) {
    if(_visible && (_currentPosition.y <= SIZE_RULER || _currentPosition.x <= SIZE_RULER)) {
      var orientation;
      if(_currentPosition.x > SIZE_RULER){
        orientation = TYPE_GUIDE_H;
      }
      else {
        orientation = TYPE_GUIDE_V;
      }

      _currentGuide = create(orientation);
    }
  }

  var create = function (orientation) {
    var guide = document.createElement('div');
    guide.setAttribute('class', orientation + '-guide guides show');
    guide.setAttribute('id', _guides.length);
    guide.addEventListener('mousedown', move, false);
    _shadow.appendChild(guide);
    var guideObject = { "element" : guide, "type": orientation };
    return guideObject;
  }

  var place = function () {
    if(_visible == false || typeof _currentGuide === 'undefined') { return false; }
    if((_currentGuide.type == TYPE_GUIDE_H && _currentGuide.element.offsetTop <= SIZE_RULER)
      || (_currentGuide.type == TYPE_GUIDE_V) && _currentGuide.element.offsetLeft <= SIZE_RULER) {
      _shadow.removeChild(_currentGuide.element);
    }
    else {
      save(_currentGuide);
    }
    _currentGuide = undefined;
  }

  var clear = function () {
    console.log('guides clear');
  };

  var lock = function () {
    console.log('guides lock');
  };

  var save = function (guide) {
    guide.element.setAttribute('data-index', _guides.length);
    _guides.push(guide);
  };

  var move = function (event) {
    var index = event.target.getAttribute('data-index');
    _currentGuide = _guides[index];
  }


  // general methods

  var disableDraggingFor = function (element) {
    // this works for FireFox and WebKit in future according to http://help.dottoro.com/lhqsqbtn.php
    element.draggable = false;
    // this works for older web layout engines
    element.onmousedown = function(event) {
      event.preventDefault();
      return false;
    };
  }

  var show = function () {
    addClass(_shadow.getElementsByClassName('guides'), 'show');
    _visible = true;
  };

  var hide = function () {
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