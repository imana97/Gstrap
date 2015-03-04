(function(){
    return function(container,$g,req){
        //var container= $(document.createElement('div')).addClass('contianer');

        if ($g.loggedUser){
            dpd.todo.get({ownerId:$g.loggedUser.id},function (result, err) {
                if(err) return console.log(err);
                console.log(result);
                $g.render('modules/todo/todo.ejs',{result:result},function(view){
                    container.html(view);

                    $('#todo-table').on('click','.delete-note',function(e){
                        console.log(e);
                        dpd.todo.del(e.target.id, function (err) {
                            if(err) console.log(err);
                            $(e.target).parent().parent().remove();
                        });
                    });

                    $('#new-to-do-btn').on('click',function(){
                        var val=$('#new-to-do-txt').val();
                        dpd.todo.post({"note":val}, function(result, err) {
                            if(err) return console.log(err);
                            $('#todo-table').append('<tr><td><a id="'+result.id+'" class="delete-note btn btn-danger btn-xs">x</a></td><td>'+result.note+'</td><td>'+moment(result.timestamp).fromNow()+'</td></tr>');
                        });
                    });

                });
            });
        } else {
            container.html('you need to log in first');
        }
    }
})();

