(function () {

    var controller= function (req,$g) {
        //var container= $(document.createElement('div')).addClass('contianer');

        if ($g.loggedUser) {
            dpd.todo.get({ownerId: $g.loggedUser.id}, function (result, err) {
                if (err) return console.log(err);
                $g.render('modules/todo/todo.ejs', {result: result}, function (view) {
                    $g.page.html(view);

                    $('#todo-table').on('click', '.delete-note', function (e) {
                        dpd.todo.del(e.target.id, function (err) {
                            if (err) console.log(err);
                            $(e.target).parent().parent().remove();
                        });
                    });

                    $('#new-to-do-btn').on('click', function () {
                        var val = $('#new-to-do-txt').val();
                        dpd.todo.post({"note": val}, function (result, err) {
                            if (err) return console.log(err);
                            $('#todo-table').append('<tr><td><a id="' + result.id + '" class="delete-note btn btn-danger btn-xs">x</a></td><td>' + result.note + '</td><td>' + moment(result.timestamp).fromNow() + '</td></tr>');
                        });
                    });

                });
            });
        } else {
            $g.page.html('you need to log in first');
        }
    };



    return {
        routes:[
            {
                route:"todo/",
                callback:controller
            }
        ]
    }
})();

