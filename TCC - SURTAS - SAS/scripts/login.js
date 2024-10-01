$(document).ready(function() {
    $('#loginForm').submit(function(event) {
        event.preventDefault();

        var username = $('#username').val();
        var password = $('#password').val();

        if (username === '' || password === '') {
            $('#error-message').text('Prontuário e senha são obrigatórios.')
                .show() // Exibe imediatamente
                .delay(4000) // Aguarda 4 segundos
                .fadeOut(500); // Esconde lentamente
            return;
        }

        // Envia os dados para o servidor via AJAX
        $.ajax({
            url: 'index.php', // URL do arquivo PHP de login
            type: 'POST',
            dataType: 'json', // Definindo que esperamos um JSON de resposta
            data: {
                username: username,
                password: password
            },
            success: function(response) {
                console.log(response);
                if (response.success) {
                    // Redireciona para a URL retornada no JSON
                    window.location.href = response.redirect;
                } else {
                    $('#error-message').text(response.message)
                        .show() // Exibe imediatamente
                        .delay(4000) // Aguarda 4 segundos
                        .fadeOut(500); // Esconde lentamente
                }
            },
            error: function(xhr, status, error) {
                console.log(xhr.responseText); // Exibe o erro no console para depuração
                $('#error-message').text('Erro ao realizar login. Tente novamente.')
                    .show() // Exibe imediatamente
                    .delay(4000) // Aguarda 4 segundos
                    .fadeOut(500); // Esconde lentamente
            }
        });
    });

    $('#togglePassword').click(function() {
        var $passwordInput = $('#password');
        var type = $passwordInput.attr('type') === 'password' ? 'text' : 'password';
        $passwordInput.attr('type', type);
        $(this).find('img').attr('src', type === 'password' ? 'imagens/CloseBTS.png' : 'imagens/OpenBTS.png');
    });
});
