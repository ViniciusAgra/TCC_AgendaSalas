<?php
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);
include 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $Prontuario = trim($_POST['username']);
    $Senha = trim($_POST['password']);

    // Prepara a consulta SQL para verificar as credenciais
    $query = "SELECT * FROM usuario WHERE Prontuario = ? AND Senha = ?";
    $stmt = $conexao->prepare($query);
    
    if ($stmt === false) {
        echo json_encode(['success' => false, 'message' => 'Erro na preparação da consulta: ' . $conexao->error]);
        exit();
    }

    $stmt->bind_param("ss", $Prontuario, $Senha);
    $stmt->execute();
    $result = $stmt->get_result();

    // Verifica se o usuário foi encontrado
    if ($result->num_rows > 0) {
        $_SESSION['user'] = $Prontuario; // Armazena o prontuário na sessão
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Prontuário ou senha inválidos.']);
    }
    
    $stmt->close();
    $conexao->close();
    exit();
}
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" href="imagens/LogoIF.png">
  <link rel="stylesheet" href="styles/login.css">
  <script src="scripts/login.js" defer></script>
  <title>SAS IFSP</title>
</head>
<body>
  <div class="left-side">
    <div class="content-wrapper">
      <h2 class="welcome-text">Bem vindo!</h2>
      <form id="loginForm" action="index.php" method="POST">
        <div class="input-wrapper">
          <input type="text" id="username" name="username" placeholder="Prontuário" required>
        </div>
        <div class="input-wrapper">
          <input type="password" id="password" name="password" placeholder="Senha" required>
          <button type="button" id="togglePassword" class="toggle-password">
            <img src="imagens/CloseBTS.png" alt="Mostrar senha">
          </button>
        </div>
        <button type="submit">Entrar</button>
        
        <!-- Div para exibir as mensagens -->
        <div id="error-message" style="display: none; color: rgb(185, 3, 3); margin-top: 10px;"></div>
        
        <!-- Mensagem de erro do PHP via sessão (opcional) -->
        <?php if (isset($_SESSION['login_message'])): ?>
            <div id="error-message" style="color: rgb(185, 3, 3); margin-top: 10px;">
                <?php 
                    echo $_SESSION['login_message']; 
                    unset($_SESSION['login_message']);
                ?>
            </div>
        <?php endif; ?>
      </form>
    </div>
  </div>
  
  <div class="right-side">
    <img src="imagens/LogoIFSP.png" alt="IFSP-JCR Logo">
  </div>

  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</body>
</html>
