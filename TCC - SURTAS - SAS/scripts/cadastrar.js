$(document).ready(function() {
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

    // Manipulação do formulário de cadastro
    $('#registerForm').submit(function(event) {
        event.preventDefault();
        var nome = $('#nome').val();
        var email = $('#email').val();
        var prontuario = $('#registerProntuario').val();
        var senha = $('#senha').val();
        var isAdmin = $('#isAdmin').is(':checked');

        alert('Usuário cadastrado: \nNome: ' + nome + '\nEmail: ' + email + '\nProntuário: ' + prontuario + '\nAdmin: ' + isAdmin);
    });
});
