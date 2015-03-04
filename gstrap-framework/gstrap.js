(function (window) {
    return Gstrap = function (app) {


        var self = this;

        this.modules = {};


        // create container and append it to body
        this.container = $(document.createElement('div')).addClass('container');
        $(function(){
            $('body').append(self.container);
        });



        this.page = $(document.createElement('div')).addClass('container').html('<h1>This Page does not exist</h1>');
        this.static = function (static) {
            this.container.append(static);
        };
        this.dynamic = function (val) {
            if (val){
                this.page.html(val);
            }
            this.container.append(this.page);
        };
        var _routes = [];
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
                    callback(req);
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
        this.Queue = function (baseUrl) {
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


        // init the application
        // start a queue for loading dependencies nad authentications


        var queue = new this.Queue();

        var _loadApp=function(){
          app.beforeLoad(self,function(){
              //before load is loaded
              app.load(self);
          });
        };

        //add dependecies here
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