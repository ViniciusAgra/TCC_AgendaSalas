$(document).ready(function() {
    // Manipulação do formulário de cadastro
    $('#registerForm').submit(function(event) {
        event.preventDefault();
        var nome = $('input[name="Nome"]').val();
        var email = $('input[name="Email"]').val();
        var prontuario = $('input[name="Prontuario"]').val();
        var senha = $('input[name="Senha"]').val();
        var isAdmin = $('#admin').is(':checked');

        //alert('Usuário cadastrado: \nNome: ' + nome + '\nEmail: ' + email + '\nProntuário: ' + prontuario + '\nAdmin: ' + isAdmin);
    });

    // Manipulação do formulário de deletar usuário
    $('#deleteUserForm').submit(function(event) {
        event.preventDefault();
        var prontuario = $('#deleteProntuario').val();
        alert('Usuário com prontuário ' + prontuario + ' será deletado.');
    });

    // Manipulação do formulário de consultar usuário
    $('#consultUserForm').submit(function(event) {
        event.preventDefault();
        var prontuario = $('#consultProntuario').val();
        alert('Consultando usuário com prontuário ' + prontuario);
    });
});
