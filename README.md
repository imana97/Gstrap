# gstrap
Gstrap is a tiny and modular javascript framework that is meant for rapid prototyping of web applications and best with [Deployd](http://deployd.com/) backend.

# Quick Start

 1. Setup your project by creating an index.html file, then open it with your favorite editor
 2. In the `<head></head>` tags insert:
	 1. embed Jquery 2.X or above: because gstrap is built on top of jQuery and you need it to run gstrap.
	 2. embed `gstrap.js` or `gstra.min.js` right after the jQuery

Your code will look like this:

    <head>
	    <script src="jquery.min.js"></script>
	    <script src="gstrap.min.js"></script>
    </head>

## create the app and configure it
once you have both jquery and gstrap in the header, you can start creating you 1 page application. Yes because Gstrap framework is a single page application and all you need is one index.html file to serve the clients.

    <body>
	    <script>
	    // your code goes here
	    </script>
    </body>

```
#!javascript
		    new Gstrap({
			    name: "my app", // the name of your application
			    version: 0.0, // lets set some versioning
			    description: "description of your application", // a bit of description
			    // here you pass all the modules that you need in this app
			    modules: [
			        // for example, I need the bootstrap navbar module to show the nav
			        {
			            name: "navbar",
			            path: "modules/navbar/navbar.js"
			        },
			        {
			            name: "notFound",
			            path: "modules/page-not-found/page-not-found.js"
			        },
			        {
			            name: "userProfile",
			            path: "modules/user-profile/user-profile.js"
			        },
			
			        {
			            name: "todo",
			            path: "modules/todo/todo.js"
			        }
			    ],
			    // do things before loading the ui, for example check auth.
			    beforeLoad: function ($g, next) {
			        dpd.users.me(function (me) {
			            $g.loggedUser = me;
			            next();
			        });
			    },
			    load: function ($g) {
			        // get the $g which is the gstrap instance and let you access
			        // gstrap public methods like render and Queue
			        
			        // set the static views of the app, the one that does not change on
			        // route change :)
			        $g.static($g.modules.navbar({}, $g));
			
			        // set the default dynamic page, if the route is not found
			        $g.dynamic($g.modules.notFound());
			        $g.route('', function (req) {
			            $g.page.html("front end");
			        });
			        // and some more routes like logout
			        $g.route('logout/', function (req) {
			            dpd.users.logout(function (err) {
			                window.location.href = 'index.html';
			                if (err) console.log(err);
			            });
			        });
			        
			        // listen will registers and listen to the above routes.
			        $g.listen();
			    }
			});

```
		    



# Gstrap Modules

to be continued...
