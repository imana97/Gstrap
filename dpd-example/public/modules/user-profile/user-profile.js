/**
 * Created by imano on 3/4/15.
 */
(function(){
    return function($g,container){
        // this is a module
        if ($g.loggedUser){
            $g.render('modules/user-profile/user-profile.ejs',$g.loggedUser,function(view){

                container.html(view);

                // and then we take care of the business logic here


            });

        } else {
            container.html("you need to login first");
        }
    }
})();