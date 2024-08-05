$(document).ready(function() {
    var gradientColors = ['#e3fdd9', '#e9fae4', '#f3ffef']; // Cores do gradiente
    var $button = $('button');
    var gradient = 'radial-gradient(circle at 0% 0%, ' + gradientColors.join(', ') + ')';
  
    $button.css({
        'background-image': gradient,
        'color': 'green',
        'padding': '10px 20px',
        'border': 'none',
        'border-radius': '5px',
        'cursor': 'pointer'
    });
  
    $button.hover(function() {
        $(this).css('background-color', '#ddd');
    }, function() {
        $(this).css('background-color', 'white');
    });

    $('.input-wrapper').each(function() {
        var $input = $(this).find('input');
        var gradient = 'radial-gradient(circle at 0% 0%, ' + gradientColors.join(', ') + ')';
        
        $input.css({
            'background-image': gradient,
            'color': 'black',
            'padding': '10px',
            'border-radius': '5px',
            'border': 'none',
            'width': '100%'
        });
    });

    $('#loginForm').submit(function(event) {
        // Previne o envio padrão do formulário
        event.preventDefault();

        // Obtém os valores dos campos de usuário e senha
        var username = $('#username').val();
        var password = $('#password').val();

        // Verifica se o usuário e senha são válidos (exemplo: admin/admin)
        if (username === 'admin' && password === 'admin') {
            // Redireciona para o outro site
            window.location.href = 'principal.html';
        } else {
            // Exibe um alerta de usuário ou senha inválidos
            alert('Usuário ou senha inválidos. Tente novamente.');
        }
    });
});
