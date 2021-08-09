// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src/js/config.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var config = {
  MY_KEY_1: '4e64f52c084e3654951dbc0177bdf7ae',
  MY_KEY_2: 'ZEGSTnyNsYLB0Y4mz8ZKMJjhGu3qkKsJmpXk3LAgsJQ'
};
var _default = config;
exports.default = _default;
},{}],"src/images/weather/storming.png":[function(require,module,exports) {
module.exports = "/storming.c455c261.png";
},{}],"src/images/weather/sunny.png":[function(require,module,exports) {
module.exports = "/sunny.66cfd8fa.png";
},{}],"src/images/weather/snowing.png":[function(require,module,exports) {
module.exports = "/snowing.dc1826ed.png";
},{}],"src/images/weather/raining.png":[function(require,module,exports) {
module.exports = "/raining.b1560358.png";
},{}],"src/images/weather/cloudy sun.png":[function(require,module,exports) {
module.exports = "/cloudy sun.1425fe6d.png";
},{}],"src/images/weather/cloudy rain.png":[function(require,module,exports) {
module.exports = "/cloudy rain.2d59ad33.png";
},{}],"src/images/weather/cloudy.png":[function(require,module,exports) {
module.exports = "/cloudy.f668b013.png";
},{}],"src/images/weather/windy.png":[function(require,module,exports) {
module.exports = "/windy.e8f5e152.png";
},{}],"src/images/todo/uncheck1.png":[function(require,module,exports) {
module.exports = "/uncheck1.c79750a4.png";
},{}],"src/images/todo/trash1.png":[function(require,module,exports) {
module.exports = "/trash1.3c262aa8.png";
},{}],"src/images/todo/checked1.png":[function(require,module,exports) {
module.exports = "/checked1.cc84f948.png";
},{}],"src/js/index.js":[function(require,module,exports) {
"use strict";

var _config = _interopRequireDefault(require("./config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Weather App
// API 
var api = {
  keyOne: _config.default.MY_KEY_1,
  keyTwo: _config.default.MY_KEY_2,
  base: "https://api.openweathermap.org/data/2.5/"
}; // HTML TAgs

var searchBox = document.querySelector('.search-box');
var temperatureIcon = document.querySelector('.temperature-icon');
var temperatureDegree = document.querySelector('.temperature-degree');
var geolocation = document.querySelector('.location');
var humidity = document.querySelector('.humidity');
var wind = document.querySelector('.wind');
searchBox.addEventListener('keypress', setQuery);
window.addEventListener("load", function () {
  var lon;
  var lat;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      lon = position.coords.longitude;
      lat = position.coords.latitude;
      fetch("".concat(api.base, "weather?lat=").concat(lat, "&lon=").concat(lon, "&units=metric&APPID=").concat(api.keyOne)).then(function (weather) {
        return weather.json();
      }).then(displayResults);
    });
  }

  greetings();
  generateQuote();
  dateToday();
  changeDate();
});

function setQuery(e) {
  if (e.keyCode === 13) {
    getResults(searchBox.value);
  }
}

function getResults(query) {
  fetch("".concat(api.base, "weather?q=").concat(query, "&units=metric&APPID=").concat(api.keyOne)).then(function (weather) {
    return weather.json();
  }).then(displayResults);
}

function displayResults(weather) {
  temperatureDegree.textContent = Math.round(weather.main.temp);
  geolocation.textContent = "".concat(weather.name, ", ").concat(weather.sys.country);
  humidity.textContent = "".concat(weather.main.humidity, "%");
  wind.textContent = "".concat(weather.wind.speed.toFixed(1), "mph");

  if (weather.weather[0].main === "Thunderstorm") {
    temperatureIcon.src = "".concat(require("../images/weather/storming.png"));
  } else if (weather.weather[0].main === "Clear") {
    temperatureIcon.src = "".concat(require("../images/weather/sunny.png"));
  } else if (weather.weather[0].main === "Snow") {
    temperatureIcon.src = "".concat(require("../images/weather/snowing.png"));
  } else if (weather.weather[0].main === "Rain") {
    temperatureIcon.src = "".concat(require("../images/weather/raining.png"));
  } else if (weather.weather[0].description === "few clouds" || weather.weather[0].description === "scattered clouds") {
    temperatureIcon.src = "".concat(require("../images/weather/cloudy sun.png"));
  } else if (weather.weather[0].main === "Drizzle") {
    temperatureIcon.src = "".concat(require("../images/weather/cloudy rain.png"));
  } else if (weather.weather[0].description === "broken clouds" || weather.weather[0].description === "overcast clouds") {
    temperatureIcon.src = "".concat(require("../images/weather/cloudy.png"));
  } else if (weather.wind.speed > 30) {
    temperatureIcon.src = "".concat(require("../images/weather/windy.png"));
  }

  searchBox.value = '';
} // Greeting App
// HTML Tags


var time = document.querySelector('.time');
var greeting = document.querySelector('.greeting');
var quote = document.querySelector('.quote');
var quoteOrigin = document.querySelector('.quote-origin');
var todayDate = document.querySelector('.today-date');

function greetings() {
  var date = new Date(); // Time

  var hours = addZero(date.getHours());
  var minutes = addZero(date.getMinutes());
  var currentTime = "".concat(hours, ":").concat(minutes);
  time.textContent = currentTime;
  setTimeout(greetings, 1000);

  if (hours >= 12 && hours < 18) {
    greeting.textContent = 'Good afternoon, Patrick';
  } else if (hours >= 18 && hours !== 4) {
    greeting.textContent = 'Good evening, Patrick';
  } else if (hours >= 4 && hours < 12) {
    greeting.textContent = 'Good morning, Patrick';
  }
}

function addZero(num) {
  return num < 10 ? "0".concat(num) : num;
} // Intention


var intentionInput = document.querySelector('.intention-input');
var intentionAnswer = document.querySelector('.intention-answer');
var intentionCta = document.querySelector('.intention-cta');
var intentionIcons = document.querySelectorAll('.intention-icons');
var intentionQuestionContainer = document.querySelector('.intention-question-container');
var intentionAnswerContainer = document.querySelector('.intention-answer-container');
intentionInput.addEventListener('keypress', changeIntention);
intentionCta.addEventListener('mouseover', intentionAnswerIcons);
intentionCta.addEventListener('mouseleave', removeIntentionIcons);

function changeIntention(e) {
  if (e.keyCode === 13 && e.target.value !== '') {
    intentionQuestionContainer.style.opacity = '0';
    setTimeout(function () {
      intentionQuestionContainer.style.visibility = 'hidden';
      intentionAnswer.textContent = e.target.value;
      intentionAnswerContainer.style.visibility = 'visible';
      intentionAnswerContainer.style.opacity = '1';
    }, 600);
  }
}

function intentionAnswerIcons() {
  intentionIcons.forEach(function (icon) {
    icon.style.visibility = 'visible';
    icon.addEventListener('click', function (e) {
      intentionAnswerContainer.style.opacity = '0';
      setTimeout(function () {
        intentionAnswerContainer.style.visibility = 'hidden';
        intentionQuestionContainer.style.opacity = '1';
        intentionQuestionContainer.style.visibility = 'visible';
      }, 600);

      if (e.target.classList.contains('fa-times')) {
        intentionInput.value = '';
      }
    });
  });
}

function removeIntentionIcons() {
  intentionIcons.forEach(function (icon) {
    return icon.style.visibility = 'hidden';
  });
} // Footer


var backgroundLocation = document.querySelector('.background-location');
var changeBackground = document.querySelector('.changeBackground');
var heartBackground = document.querySelector('.background-photo');
var backgroundDetails = document.querySelector('.background-details');
var backgroundInfo = document.querySelector('.background-info');
var backgroundUser = document.querySelector('.background-user');
var backgroundUserLink = document.querySelector('.background-user-link');
var changeQuote = document.querySelector('.changeQuote');
var quotesInfo = document.querySelector('.quotes-info');
var inspirationalQuote = document.querySelector('.quote');
var quoteDetails = document.querySelector('.quote-details');
changeBackground.addEventListener('click', generateBackground);
changeQuote.addEventListener('click', generateQuote);
backgroundInfo.addEventListener('mouseenter', showBackgroundDetails);
backgroundInfo.addEventListener('mouseleave', showBackgroundDetails);
quotesInfo.addEventListener('mouseenter', showQuoteDetails);
quotesInfo.addEventListener('mouseleave', showQuoteDetails);

function generateQuote() {
  fetch("https://type.fit/api/quotes").then(function (response) {
    return response.json();
  }).then(function (data) {
    var index = Math.floor(Math.random() * data.length);
    quote.textContent = "".concat(data[index].text);

    if (data[index].author === null) {
      quoteOrigin.textContent = 'Unknown';
    } else {
      quoteOrigin.textContent = "".concat(data[index].author);
    }
  });
}

function generateBackground() {
  fetch("https://api.unsplash.com/collections/GsNw3bdVLPM/photos/?client_id=".concat(api.keyTwo, "&per_page=30")).then(function (response) {
    return response.json();
  }).then(function (data) {
    var bgIndex = data[Math.floor(Math.random() * data.length)];
    document.body.style.backgroundImage = "url(".concat(bgIndex.urls.full, ")");
    console.log(bgIndex);
    return fetch("https://api.unsplash.com/photos/".concat(bgIndex.id, "/?client_id=").concat(api.keyTwo));
  }).then(function (response) {
    return response.json();
  }).then(function (data) {
    console.log(data);
    data.location.title === null ? backgroundLocation.textContent = 'Unknown' : backgroundLocation.textContent = data.location.title;
    backgroundUser.textContent = data.user.name;
    backgroundUserLink.href = data.user.links.html;
    heartBackground.href = data.links.html;
  });
}

function showBackgroundDetails() {
  backgroundDetails.classList.toggle('background-show');
  backgroundLocation.classList.toggle('background-show');
}

function showQuoteDetails() {
  inspirationalQuote.classList.toggle('background-show');
  quoteDetails.classList.toggle('background-show');
} // Todo List App


function dateToday(x) {
  var date = new Date();
  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  todayDate.textContent = "".concat(days[date.getDay()], ", ").concat(date.getDate(), " ").concat(months[date.getMonth()], " ").concat(date.getFullYear());
} // HTML Tags


var todoList = document.querySelector('.todo-list');
var addInput = document.querySelector('.add-input');
var addBtn = document.querySelector('.add-btn');
var filterOption = document.querySelector('.filter-todo');
var todoOpen = document.querySelector('.todo-open');
var todoApp = document.querySelector('.todo-app');
var main = document.querySelector('main');
document.addEventListener('DOMContentLoaded', getTodos);
addBtn.addEventListener('click', addTodo);
todoList.addEventListener('click', deleteCheck);
filterOption.addEventListener('click', filterTodo);
todoOpen.addEventListener('click', openTodoList);

function openTodoList() {
  todoApp.classList.toggle('todo-close');
  main.classList.toggle('main-left');
} // Global - LocalStorage variable


var todos;

if (localStorage.getItem('todos') === null) {
  todos = [];
} else {
  todos = JSON.parse(localStorage.getItem('todos'));
}

function addTodo(event) {
  event.preventDefault(); // Todo DIV

  var todoDiv = document.createElement('div');
  todoDiv.classList.add("todo"); // Todo LI

  var newTodo = document.createElement('li');
  newTodo.innerText = addInput.value;
  newTodo.classList.add('todo-item');
  todoDiv.appendChild(newTodo); // Add todo to Local Storage

  saveLocalTodos(addInput.value); // Check Mark Button

  var completedButton = document.createElement('button');
  completedButton.innerHTML = "<img src='".concat(require("../images/todo/uncheck1.png"), "'>");
  completedButton.classList.add('complete-btn');
  todoDiv.appendChild(completedButton); // Delete Mark Button

  var trashButton = document.createElement('button');
  trashButton.innerHTML = "<img src='".concat(require("../images/todo/trash1.png"), "'>");
  trashButton.classList.add('trash-btn');
  todoDiv.appendChild(trashButton);
  todoList.appendChild(todoDiv);
  addInput.value = '';
}

function deleteCheck(e) {
  var item = e.target;
  var todo = item.parentElement;
  var nodes = Array.prototype.slice.call(todoList.children); // Check Mark

  if (item.classList[0] === 'complete-btn') {
    todo.classList.toggle('completed');
  }

  if (item.firstElementChild.src.match('uncheck1')) {
    item.firstElementChild.src = require("../images/todo/checked1.png");
  } else if (item.firstElementChild.src.match('checked')) {
    item.firstElementChild.src = require("../images/todo/uncheck1.png");
    todo.style.transition = "all 0.5s ease";
  } else {
    item.firstElementChild.src = require("../images/todo/trash1.png");
    todo.style.transition = "all 0.5s ease";
  }

  if (todo.classList.contains('completed')) {
    todos[nodes.indexOf(todo)].status = 'complete';
  } else {
    todos[nodes.indexOf(todo)].status = 'incomplete';
  }

  localStorage.setItem('todos', JSON.stringify(todos)); // Delete Todo

  if (item.classList[0] === 'trash-btn') {
    // Animation
    todo.classList.add('fall');
    removeLocalTodos(nodes.indexOf(todo));
    todo.addEventListener('transitionend', function () {
      todo.remove();
    });
  }
}

function filterTodo(e) {
  var todos = todoList.childNodes;
  todos.forEach(function (todo) {
    switch (e.target.value) {
      case 'all':
        todo.style.display = 'flex';
        break;

      case 'completed':
        if (todo.classList.contains('completed')) {
          todo.style.display = 'flex';
        } else {
          todo.style.display = 'none';
        }

        break;

      case 'uncompleted':
        if (!todo.classList.contains('completed')) {
          todo.style.display = 'flex';
        } else {
          todo.style.display = 'none';
        }

        break;
    }
  });
}

function saveLocalTodos(todo) {
  todos.push({
    item: todo,
    status: 'incomplete'
  });
  localStorage.setItem('todos', JSON.stringify(todos));
}

function getTodos() {
  todos.forEach(function (todo) {
    // Todo DIV
    var todoDiv = document.createElement('div');
    todoDiv.classList.add("todo"); // Todo LI

    var newTodo = document.createElement('li');
    newTodo.innerText = todo.item;
    newTodo.classList.add('todo-item');
    todoDiv.appendChild(newTodo); // Check Mark Button

    var completedButton = document.createElement('button');
    completedButton.innerHTML = "<img src='".concat(require("../images/todo/uncheck1.png"), "'>");
    completedButton.classList.add('complete-btn');
    todoDiv.appendChild(completedButton); // Delete Mark Button

    var trashButton = document.createElement('button');
    trashButton.innerHTML = "<img src='".concat(require("../images/todo/trash1.png"), "'>");
    trashButton.classList.add('trash-btn');
    todoDiv.appendChild(trashButton);

    if (todo.status === 'complete') {
      newTodo.parentElement.classList.add('completed');
      completedButton.innerHTML = "<img src='".concat(require("../images/todo/checked1.png"), "'>");
    }

    todoList.appendChild(todoDiv);
  });
}

function removeLocalTodos(todo) {
  todos.splice(todo, 1);
  localStorage.setItem('todos', JSON.stringify(todos));
}

function changeDate() {
  var date = new Date();
  var shortenedDays = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];
  var shortenedMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

  if (x.matches) {
    todayDate.textContent = "".concat(shortenedDays[date.getDay()], ", ").concat(date.getDate(), " ").concat(shortenedMonths[date.getMonth()], " ").concat(date.getFullYear());
  } else {
    dateToday();
  }
}

var x = window.matchMedia("(max-width: 1350px)");
x.addEventListener('change', changeDate);
new Sortable(todolist, {
  animation: 150,
  onUpdate: function onUpdate(e) {
    function array_move(arr, old_index, new_index) {
      arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
      return arr;
    }

    ;
    array_move(todos, e.oldIndex, e.newIndex);
    localStorage.setItem('todos', JSON.stringify(todos));
  }
});
document.addEventListener('DOMContentLoaded', function () {
  var todoItems = document.querySelectorAll('.todo-item');
  todoItems.forEach(function (items) {
    items.setAttribute("contenteditable", "true");
  });
});
},{"./config":"src/js/config.js","../images/weather/storming.png":"src/images/weather/storming.png","../images/weather/sunny.png":"src/images/weather/sunny.png","../images/weather/snowing.png":"src/images/weather/snowing.png","../images/weather/raining.png":"src/images/weather/raining.png","../images/weather/cloudy sun.png":"src/images/weather/cloudy sun.png","../images/weather/cloudy rain.png":"src/images/weather/cloudy rain.png","../images/weather/cloudy.png":"src/images/weather/cloudy.png","../images/weather/windy.png":"src/images/weather/windy.png","../images/todo/uncheck1.png":"src/images/todo/uncheck1.png","../images/todo/trash1.png":"src/images/todo/trash1.png","../images/todo/checked1.png":"src/images/todo/checked1.png"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "54925" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/js/index.js"], null)
//# sourceMappingURL=/js.d818e0ef.js.map