
new Gstrap({
    name:"my app",
    version:0.0,
    description:"description of your application",
    modules:[
        {
            name:"navbar",
            path:"modules/navbar/navbar.js"
        },
        {
            name:"notFound",
            path:"modules/page-not-found/page-not-found.js"
        },
        {
            name:"userProfile",
            path:"modules/user-profile/user-profile.js"
        },

        {
            name:"todo",
            path:"modules/todo/todo.js"
        }
    ],
    beforeLoad:function($g,next){
        // dpd authentication
        dpd.users.me(function(me) {
            $g.loggedUser=me;
            // run the rest if the user is or is not authenticated.
            next();
        });
    },
    load:function($g){

        // add the static modules. does not change on route change
        $g.static($g.modules.navbar({
                appName: "gsrap",
                navBarType:"navbar-inverse",
                navigation: [
                    {
                        name: "Home",
                        link: "#!/"
                    },
                    {
                        name: "ToDo",
                        link: "#!/todo/"
                    }
                ],
                loggedUser:$g.loggedUser //logged user object
          },$g));

        // place the dynamic modules.
        $g.dynamic($g.modules.notFound());

        // listen to routes
        $g.route('', function (req) {
            $g.page.html("front end");
        });



        $g.route('todo/', function (req) {
            $g.modules.todo($g.page,$g,req);
        });


        // logout action. logout with dpd and reload the page
        $g.route('logout/', function (req) {
            dpd.users.logout(function(err) {
                window.location.href='index.html';
                if(err) console.log(err);
            });
        });

        $g.route('user-profile/',function(req){
           $g.modules.userProfile($g,$g.page);
        });

        // listen to routes on change.
        $g.listen();


    }

});











