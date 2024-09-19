<?php
include 'config.php';

// Verifica se os dados do formulário foram enviados
if (isset($_POST['Nome']) && isset($_POST['Email']) && isset($_POST['Prontuario']) && isset($_POST['Senha'])) {
    // Recupera os dados do formulário
    $Nome = $_POST['Nome'];
    $Email = $_POST['Email'];
    $Prontuario = $_POST['Prontuario'];
    $Senha = $_POST['Senha'];
    $ADM = isset($_POST['ADM']) ? 1 : 0;

    // Prepara a consulta SQL
    $result = "INSERT INTO usuario (Prontuario, Nome, Email, Senha, ADM) VALUES (?, ?, ?, ?, ?)";
    $stmt = $conexao->prepare($result);

    if ($stmt === false) {
        die('Erro na preparação da consulta: ' . $conexao->error);
    }

    $stmt->bind_param("ssssi", $Prontuario, $Nome, $Email, $Senha, $ADM);

    // Executa a consulta
    if ($stmt->execute()) {
      echo '<div class="cadConcluido">Cadastro Concluido!</div>';
    } else {
      '<div class="cadNegado">Cadastro Negado!</div>';
    }
    $stmt->close();
} 

$conexao->close();
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" href="imagens/LogoIF.png">
  <link rel="stylesheet" href="styles/cadastrar.css">
  <script src="scripts/cadastrar.js" defer></script>
  <title>SAS IFSP</title>
</head>
<body>
  <!-- Divisão da tela em duas partes -->
  <div class="left-side">
    <!-- Card maior na esquerda -->
    <div class="box cadastro">
      <div class="title-wrapper">
        <img src="imagens/LogoSAS.png" alt="Logo SAS" class="logo-sas">
        <h1>Cadastro</h1>
        <img src="imagens/LogoIFSP.png" alt="Logo IFSP" class="logo-if">
      </div>
      <form action="cadastrar.php" method="POST">
        <input type="text" name="Nome" placeholder="Nome" required>
        <input type="email" name="Email" placeholder="Email" required>
        <input type="text" name="Prontuario" placeholder="Prontuário" required>
        <input type="password" name="Senha" placeholder="Senha" required>
        <div class="admin-toggle">
          <label for="admin">ADM</label>
          <label class="switch">
            <input type="checkbox" name="ADM" id="admin">
            <span class="slider round"></span>
          </label>
        </div>
        <div class="button-wrapper">
          <button type="submit" id="Cadastrar">Cadastrar</button>
        </div>
      </form>
    </div>
  </div>

  <div class="right-side">
    <!-- Cards menores na direita -->
    <div class="box deletar">
      <div class="title-wrapper">
        <img src="imagens/LogoSAS.png" alt="Logo SAS" class="logo-sas">
        <h2>Deletar Usuário</h2>
        <img src="imagens/LogoIFSP.png" alt="Logo IFSP" class="logo-if">
      </div>
      <input type="text" placeholder="Prontuário">
      <div class="button-wrapper">
        <button id="Deletar">DELETAR</button>
      </div>
    </div>

    <div class="box consultar">
      <div class="title-wrapper">
        <img src="imagens/LogoSAS.png" alt="Logo SAS" class="logo-sas">
        <h2>Consultar Usuário</h2>
        <img src="imagens/LogoIFSP.png" alt="Logo IFSP" class="logo-if">
      </div>
      <input type="text" placeholder="Prontuário">
      <div class="button-wrapper">
        <button id="Consultar">Confirmar</button>
      </div>
    </div>
  </div>

</body>
</html>
