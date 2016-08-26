Gstrap = {};
Gstrap.framework={
  version:0.2,
  description:"Mini modular single page Javascript framework built on top of jQuery",
  developer:"Iman Khaghani Far",
  contact:"iman.khaghani@gmail.com",
  license:"MIT",
  repository:"https://github.com/imana97/gstrap"
};
/**
 * Gstrap app builder builds the application
 * @param app
 * @returns {boolean}
 * @constructor
 */
Gstrap.AppBuilder = function (app) {


  // check jquery
  if (typeof ($) === "undefined") {
    alert("Jquery was not found!");
    return false;
  }

  var self = this; // reference to main this
  var _routes = []; // list of all routes and callbacks
  this.modules = {}; // module container. All added modules will be held here with their name as key

  /**
   * returns the name of the application
   * @returns {string} appName
   */
  this.getAppName = function () {
    return app.name;
  };

  /**
   * returns the version of the app
   * @returns {number} appVersion
   */
  this.getAppVersion = function () {
    return app.version;
  };

  /**
   * returns description of the app
   * @returns {string}
   */
  this.getAppDescription = function () {
    return app.description;
  };

  /**
   * here we create the main container
   * @type {any}
   */
  this.container = $(document.createElement('div')).addClass('container');
  $(function () {
    $('body').append(self.container);
  });

  /**
   * page is the dynamic sub container that changes as route changes
   * @type {any}
   */
  this.page = $(document.createElement('div')).addClass('container');

  /**
   * static does is a sub container in the main container that does not change by route change
   * @param static
   */
  this.appendStatic = function (s) {
    this.container.append(s);
  };

  /**
   * I don't know what this is.
   * @param val
   */
  this.appendDynamic = function (val) {
    if (val) {
      this.page.html(val);
    }
    this.container.append(this.page);
  };


  /**
   * Route accepts a path that appends to # and register a callback to that route.
   * Hence, every time the address bar value changes, the route listener goes through
   * all of the registered routes and fire the callback if the route is registered.
   * @param path the path for the callback
   * @param callback the callback function to fire when the path matched. the fired callback
   * has two parameters, the req, containing path, and parameters and the $g object
   * @private
   */
  var _route = function (path, callback) {
    var hashArr = window.location.hash.slice(3).split('/');
    var pathArr = path.split('/');
    var req = {
      path: path,
      params: {}
    };
    if (hashArr.length == pathArr.length) {
      var check = true;
      $.each(pathArr, function (p, path) {
        if (path.substr(0, 1) == ":") {
          req.params[path.slice(1)] = hashArr[p];
        } else {

          if (path != hashArr[p]) {
            check = false;
          }
        }
      });
      if (check) {
        callback(req, self);
      }
    }
  };

  /**
   *
   * @param path
   * @param data
   * @param callback
   */
  this.render = function (path, data, callback) {
    var cache = {};
    var _template = function tmpl(str, data) {
      /**
       * Figure out if we're getting a template, or if we need to
       * load the template - and be sure to cache the result.
       */
      var fn = !/\W/.test(str) ?
        cache[str] = cache[str] ||
          tmpl(document.getElementById(str).innerHTML) :

        /**
         * Generate a reusable function that will serve as a template
         * generator (and which will be cached).
         */
        new Function("obj",
          "var p=[],print=function(){p.push.apply(p,arguments);};" +
          // Introduce the data as local variables using with(){}
          "with(obj){p.push('" +
          // Convert the template into pure JavaScript
          str
            .replace(/[\r\t\n]/g, " ")
            .split("<%").join("\t")
            .replace(/((^|%>)[^\t]*)'/g, "$1\r")
            .replace(/\t=(.*?)%>/g, "',$1,'")
            .split("\t").join("');")
            .split("%>").join("p.push('")
            .split("\r").join("\\'")
          + "');}return p.join('');");

      // Provide some basic currying to the user
      return data ? fn(data) : fn;
    };
    $.ajax({
      url: path,
      dataType: "text",
      success: function (string) {

        if (typeof(ejs)=="undefined"){
          // using embedded ejs
          //callback(_template(string, data));
        } else {
          // recommended
          callback(ejs.render(string, data));
        }
      }
    });
  };


  /**
   * adding new routes
   * @param path
   * @param callback
   * @private
   */
  var _addRoute = function (path, callback) {
    _routes.push({path: path, callback: callback});
  };


  /**
   * _listen register all of the routes to the route change listener
   * @private
   */
  var _listen = function () {
    $.each(_routes, function (r, ro) {
      _route(ro.path, ro.callback);
    });
    window.onhashchange = function () {
      $.each(_routes, function (r, ro) {
        _route(ro.path, ro.callback);
      });
    }
  };

  /**
   * return registered routes.
   * @returns {Array}
   */
  this.getRoutes = function () {
    return _routes;
  };


  /**
   * this function add all of the routes found in the loaded modules
   * @private
   */
  var _loadModulesRoutes = function () {
    for (var m in self.modules) {
      if (typeof(self.modules[m].routes) !== "undefined") {
        var routes = self.modules[m].routes;
        for (var r in routes) {
          _addRoute(routes[r].route, routes[r].callback);
        }
      }
    }
  };


  /**
   * If beforeload is not called, then define before load.
   */
  if (!app.beforeLoad) {
    app.beforeLoad = function ($s, next) {
      next();
    }
  }

  /**
   *
   * @private
   */
  var _loadApp = function () {
    app.beforeLoad(self, function () {
      //before load is loaded
      _loadModulesRoutes();
      // load the user defined load
      app.load(self);
      // listen to all routes
      _listen();
    });
  };

  /**
   * dep loader loads all of the modules required for the app before anything happens. After all modules loaded successfully, deploader
   * will load the app.
   * @param modules
   * @private
   */
  var _depLoader = function (modules) {
    if (modules.length == 0) {
      _loadApp();
    } else {
      $.ajax({
        url: modules[0].path,
        dataType: "text",
        success: function (data) {
          self.modules[modules[0].name] = eval(data);
          modules.shift();
          _depLoader(modules);
        }
      });
    }
  };

  _depLoader(app.modules);
};
Gstrap.ViewBuilder=function () {
  var _templateUrl='public/modules/default/default.ejs';
  var _templateObject={};
  var _route='';
  var _controller=function(req,$g){};

  this.setTemplate = function (url, object) {
    // we set the template here
    _templateUrl=url;
    _templateObject=object;
    return this;
  };

  this.setRoute = function (route) {
    _route=route;
    return this;
  };

  this.setController = function (controller) {
    _controller=controller;
    return this;
  };

  this.getView=function(){
    var controller=function(req,$g){
      $g.render(_templateUrl,{req:req,$g:$g,obj:_templateObject}, function (view) {
        $g.page.html(view);
        _controller(req,$g);
      });
    };
    return {
      routes:[
        {
          route:_route,
          callback:controller
        }
      ]
    };
  }
};
Gstrap.tools={};
Gstrap.tools.Queue=function (baseUrl) {
  var self = this;
  self.path = baseUrl || "#";
  self.queue = [];
  self.lastData = null;
  self.next = function (func) {
    self.queue.push(func);
    return self;
  };
  self.callback = function () {
    self.queue.shift();
    if (self.queue.length > 0) {
      _runArray(self.queue[0]);
    }
  };
  var _getParamNames = function (func) {
    var funStr = func.toString();
    var arr = funStr.slice(funStr.indexOf('(') + 1, funStr.indexOf(')')).match(/([^s,]+)/g);
    return (arr == null);
  };
  var _runArray = function (func) {
    _getParamNames(func) ? func() : func(self.callback);
  };
  self.run = function () {
    if (self.queue.length > 0) {
      _runArray(self.queue[0]);
    }
  };
};




