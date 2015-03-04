(function () {
    return function (settings,$g) {
        var navbar = $(document.createElement('div')).addClass('navbar navbar-fixed-top navbar-inverse');
        $g.render('modules/navbar/navbar.ejs', settings, function (view) {
            navbar.html(view);

            $('#btn-login').click(function (e) {
                var username = $('#input-username').val();
                var password = $('#input-password').val();
                dpd.users.login({username: username, password: password}, function (me) {
                    if (me) {
                        window.location.reload();
                    }
                });
            });

        });
        return navbar;
    };
})();

