$(document).ready(function() {

    $('#loginForm').submit(function(event) {
        event.preventDefault();

        var username = $('#username').val();
        var password = $('#password').val();

        if (username === 'admin' && password === 'admin') {
            window.location.href = 'principal.html';
        } else {
            $('#error-message').text('Usuário e/ou senha inválidos. Tente novamente.')
                .fadeIn(500)
                .delay(4000)
                .fadeOut(500);
        }
    });

    $('#togglePassword').click(function() {
        var $passwordInput = $('#password');
        var type = $passwordInput.attr('type') === 'password' ? 'text' : 'password';
        $passwordInput.attr('type', type);
        $(this).find('img').attr('src', type === 'password' ? 'imagens/CloseBTS.png' : 'imagens/OpenBTS.png');
    });
});
