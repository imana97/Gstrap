(function (window) {
    return Gstrap = function (app) {

        // check jquery
        if (typeof ($)==="undefined"){
            alert("Jquery was not found!");
            return false;
        }

        var self = this;
        var _routes = [];
        this.modules = {};


        // create container and append it to body
        this.container = $(document.createElement('div')).addClass('container');
        $(function(){
            $('body').append(self.container);
        });

        this.page = $(document.createElement('div')).addClass('container');
        this.static = function (static) {
            this.container.append(static);
        };
        this.dynamic = function (val) {
            if (val){
                this.page.html(val);
            }
            this.container.append(this.page);
        };

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
                    callback(req,self);
                }
            }
        };
        this.render = function (path, data, callback) {
            var cache = {};
            var _template = function tmpl(str, data) {
                // Figure out if we're getting a template, or if we need to
                // load the template - and be sure to cache the result.
                var fn = !/\W/.test(str) ?
                    cache[str] = cache[str] ||
                    tmpl(document.getElementById(str).innerHTML) :

                    // Generate a reusable function that will serve as a template
                    // generator (and which will be cached).
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
                    callback(_template(string, data));
                }
            });
        };
        this.route = function (path, callback) {
            _routes.push({path: path, callback: callback});
        };
        this.listen = function () {
            $.each(_routes, function (r, ro) {
                _route(ro.path, ro.callback);
            });
            window.onhashchange = function () {
                $.each(_routes, function (r, ro) {
                    _route(ro.path, ro.callback);
                });
            }
        };

        this.replaceView = function (page, container) {
            var container = container || this.page;
            container.empty();
            container.append(page);
        };


        var _loadModulesRoutes=function(){
            console.log("load is running");
            console.log(self.modules);
          for (var m in self.modules){
              console.log(m);
              if (typeof(self.modules[m].routes)!=="undefined"){
                  var routes=self.modules[m].routes;
                  for (var r in routes){
                      self.route(routes[r].route,routes[r].callback);
                  }
              }
          }
        };




        if (!app.beforeLoad){
            app.beforeLoad=function($s,next){
                next();
            }
        }


        var _loadApp=function(){
            console.log(_routes);
          app.beforeLoad(self,function(){
              //before load is loaded
              _loadModulesRoutes();
              app.load(self);
          });
        };


        var _depLoader=function(modules){
            if (modules.length==0){
                console.log("all modules were loaded");
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
})(window);

/*
 //before
 queue.next(function(next){
 app.beforeLoad(next);
 });



 queue.next(function(){


 for (var s in app.static){
 self.static(app.static[s]);
 }



 app.route('', function (req) {
 app.page.html("front end");
 });



 app.route('todo/', function (req) {
 app.replaceView(gstrap.controller.todo());
 });


 // logout action. logout with dpd and reload the page
 app.route('logout/', function (req) {
 dpd.users.logout(function(err) {
 window.location.href='index.html';
 if(err) console.log(err);
 });
 });

 // listen to routes on change.
 app.listen();
 });















 $(function () {

 // create an instance of the application
 app = new Gstrap();
 // reserve a value for authentication.
 app.loggedUser=null;







 // run the application.
 queue.run();

 });

 */