<?php
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);
include 'config.php';

// Função para verificar se o prontuário já existe
function prontuarioExiste($conexao, $Prontuario) {
    $query = "SELECT 1 FROM usuario WHERE Prontuario = ?";
    $stmt = $conexao->prepare($query);

    if ($stmt === false) {
        die('Erro na preparação da consulta: ' . $conexao->error);
    }

    $stmt->bind_param("s", $Prontuario);
    $stmt->execute();
    $stmt->store_result();

    // Verifica se encontrou algum registro (se o número de linhas > 0)
    $exists = $stmt->num_rows > 0;
    $stmt->close();

    return $exists;
}

// Processamento do formulário
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Verifica se todos os campos necessários estão presentes para cadastro
    if (isset($_POST['Nome'], $_POST['Email'], $_POST['Prontuario'], $_POST['Senha'])) {
        // Recupera e sanitiza os dados do formulário
        $Nome = trim($_POST['Nome']);
        $Email = trim($_POST['Email']);
        $Prontuario = trim($_POST['Prontuario']);
        $Senha = trim($_POST['Senha']);
        $ADM = isset($_POST['ADM']) ? 1 : 0;

        // Validações básicas
        if (empty($Nome) || empty($Email) || empty($Prontuario) || empty($Senha)) {
            $_SESSION['message'] = 'Todos os campos são obrigatórios.';
            $_SESSION['msg_type'] = 'error';
            header('Location:cadastrar.php');
            exit();
        }

        if (!filter_var($Email, FILTER_VALIDATE_EMAIL)) {
            $_SESSION['message'] = 'Email inválido.';
            $_SESSION['msg_type'] = 'error';
            header('Location:cadastrar.php');
            exit();
        }

        // Verifica se o prontuário já existe no banco de dados
        if (prontuarioExiste($conexao, $Prontuario)) {
            $_SESSION['message'] = 'Cadastro negado: Prontuário já existe.';
            $_SESSION['msg_type'] = 'error';
            header('Location:cadastrar.php');
            exit();
        } else {
            // Prepara a consulta SQL para inserir novo usuário
            $query = "INSERT INTO usuario (Prontuario, Nome, Email, Senha, ADM) VALUES (?, ?, ?, ?, ?)";
            $stmt = $conexao->prepare($query);

            if ($stmt === false) {
                die('Erro na preparação da consulta: ' . $conexao->error);
            }

            $stmt->bind_param("ssssi", $Prontuario, $Nome, $Email, $Senha, $ADM);

            // Executa a consulta
            if ($stmt->execute()) {
                $_SESSION['message'] = 'Cadastro realizado com sucesso!';
                $_SESSION['msg_type'] = 'success';
            } else {
                error_log("Erro ao executar a consulta: " . $stmt->error);
                $_SESSION['message'] = 'Cadastro negado: Erro ao inserir dados.';
                $_SESSION['msg_type'] = 'error';
            }

            $stmt->close();
            header('Location:cadastrar.php');
            exit();
        }
    }

    // Verifica se o formulário de consulta foi enviado
    if (isset($_POST['consultar']) && isset($_POST['ProntuarioConsulta'])) {
        $ProntuarioConsulta = trim($_POST['ProntuarioConsulta']);
        
        // Prepara a consulta SQL para buscar o usuário
        $queryConsulta = "SELECT Nome, Email, Senha, ADM FROM usuario WHERE Prontuario = ?";
        $stmtConsulta = $conexao->prepare($queryConsulta);

        if ($stmtConsulta === false) {
            die('Erro na preparação da consulta: ' . $conexao->error);
        }

        $stmtConsulta->bind_param("s", $ProntuarioConsulta);
        $stmtConsulta->execute();
        $stmtConsulta->store_result();
        
        // Verifica se o usuário foi encontrado
        if ($stmtConsulta->num_rows > 0) {
            $stmtConsulta->bind_result($NomeConsulta, $EmailConsulta, $SenhaConsulta, $ADMConsulta);
            $stmtConsulta->fetch();
            $_SESSION['consulta_result'] = [
                'Prontuario' => $ProntuarioConsulta,
                'Nome' => $NomeConsulta,
                'Email' => $EmailConsulta,
                'Senha' => $SenhaConsulta,
                'ADM' => $ADMConsulta ? 'Sim' : 'Não'
            ];
        } else {
            $_SESSION['consulta_result'] = null;
            $_SESSION['consulta_message'] = 'Cadastro não encontrado.';
            $_SESSION['consulta_msg_type'] = 'error';
        }

        $stmtConsulta->close();
        header('Location:cadastrar.php');
        exit();
    }

    if (isset($_POST['deletar']) && isset($_POST['ProntuarioDeletar'])) {
      $ProntuarioDeletar = trim($_POST['ProntuarioDeletar']);
      // Prepara a consulta SQL para deletar o usuário
      $queryDeletar = "DELETE FROM usuario WHERE Prontuario = ?";
      $stmtDeletar = $conexao->prepare($queryDeletar);

      if ($stmtDeletar === false) {
        die('Erro na preparação da consulta: ' . $conexao->error);
      }

      $stmtDeletar->bind_param("s", $ProntuarioDeletar);

      // Executa a consulta de deleção
      if ($stmtDeletar->execute()) {
        $_SESSION['mensagem'] = 'Usuário deletado com sucesso';
      } else {
        $_SESSION['mensagem'] = 'Erro ao deletar o usuário';
      }

      $stmtDeletar->close();
      header('Location:cadastrar.php');
      exit();
    }
}

$conexao->close();
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="imagens/LogoIF.png">
  <link rel="stylesheet" href="styles/cadastrar.css">
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
      <form id="registerForm" action="cadastrar.php" method="POST">
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
        <!-- Exibição das mensagens abaixo do botão -->
        <?php if (isset($_SESSION['message'])): ?>
            <div class="message <?php echo $_SESSION['msg_type']; ?>">
                <?php 
                    echo $_SESSION['message']; 
                    unset($_SESSION['message']);
                    unset($_SESSION['msg_type']);
                ?>
            </div>
        <?php endif; ?>
      </form>
    </div>
  </div>

  <!-- Card menor na direita -->
  <div class="right-side">
    <div class="box consultar">
      <div class="title-wrapper">
        <img src="imagens/LogoSAS.png" alt="Logo SAS" class="logo-sas">
        <h2>Consultar Usuário</h2>
        <img src="imagens/LogoIFSP.png" alt="Logo IFSP" class="logo-if">
      </div>
      <form id="consultarForm" action="cadastrar.php" method="POST">
        <input type="text" name="ProntuarioConsulta" placeholder="Prontuário" required>
        <div class="button-wrapper">
          <button id="Consultar" type="submit" name="consultar">Confirmar</button>
        </div>
        <?php if (isset($_SESSION['consulta_message'])): ?>
          <div class="message <?php echo $_SESSION['consulta_msg_type']; ?>">
            <?php 
                echo $_SESSION['consulta_message']; 
                unset($_SESSION['consulta_message']);
                unset($_SESSION['consulta_msg_type']);
            ?>
          </div>
        <?php endif; ?>
      </form>

      <!-- Exibe os dados do usuário consultado e o botão "Deletar" -->
      <?php if (isset($_SESSION['consulta_result'])): ?>
        <div class="consulta-result">
          <p><strong>Nome:</strong> <?php echo $_SESSION['consulta_result']['Nome']; ?></p>
          <p><strong>Email:</strong> <?php echo $_SESSION['consulta_result']['Email']; ?></p>
          <p><strong>Senha:</strong> <?php echo $_SESSION['consulta_result']['Senha']; ?></p>
          <p><strong>ADM:</strong> <?php echo $_SESSION['consulta_result']['ADM']; ?></p>
          <form action="cadastrar.php" method="POST" onsubmit="return confirm('Tem certeza que deseja deletar este usuário?');">
            <input type="hidden" name="ProntuarioDeletar" value="<?php echo $_SESSION['consulta_result']['Prontuario']; ?>">
            <button id="Deletar" type="submit" name="deletar">DELETAR</button>
          </form>
        </div>
        <?php unset($_SESSION['consulta_result']); ?>
      <?php endif; ?>
    </div>
  </div>
</body>
</html>