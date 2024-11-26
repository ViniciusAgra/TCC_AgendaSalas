<?php
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);
include 'config.php';

// Verifica se o usuário está logado
if (isset($_SESSION['user'])) {
    $prontuario = $_SESSION['user'];

    // Consulta para buscar o nome do usuário pelo prontuário
    $query = "SELECT Nome FROM usuario WHERE Prontuario = ?";
    $stmt = $conexao->prepare($query);

    if ($stmt) {
        $stmt->bind_param("s", $prontuario);
        $stmt->execute();
        $stmt->bind_result($nome);
        $stmt->fetch();
        $stmt->close();
    } else {
        $nome = "Usuário Desconhecido"; // Nome padrão em caso de falha
    }
} else {
    header("Location: index.php"); // Redireciona para o login se a sessão não estiver ativa
    exit();
}

function verificarDisponibilidade($conexao, $sala, $dia, $inicio, $fim) {
    $query = "
        SELECT 1 
        FROM reserva 
        WHERE Sala = ? 
        AND Dia = ? 
        AND (
            (Inicio < ? AND Fim > ?) OR 
            (Inicio < ? AND Fim > ?) OR 
            (Inicio >= ? AND Fim <= ?)
        )
    ";

    $stmt = $conexao->prepare($query);
    if (!$stmt) {
        die('Erro ao preparar consulta: ' . $conexao->error);
    }

    $stmt->bind_param("ssssssss", $sala, $dia, $fim, $fim, $inicio, $inicio, $inicio, $fim);
    $stmt->execute();
    $stmt->store_result();

    $ocupada = $stmt->num_rows > 0;
    $stmt->close();

    return !$ocupada; // Retorna true se a sala estiver livre
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $sala = isset($_POST['Sala']) ? trim($_POST['Sala']) : null;
    $curso = isset($_POST['Curso']) ? trim($_POST['Curso']) : null;
    $periodo = isset($_POST['Periodo']) ? trim($_POST['Periodo']) : null;
    $dia = isset($_POST['Dia']) ? trim($_POST['Dia']) : null;
    $inicio = isset($_POST['Inicio']) ? trim($_POST['Inicio']) : null;
    $fim = isset($_POST['Fim']) ? trim($_POST['Fim']) : null;
    $descricao = isset($_POST['Descricao']) ? trim($_POST['Descricao']) : null;
    $professor = $_SESSION['user'] ?? null; // Assume que o prontuário do professor está armazenado na sessão
    $professor2 = isset($_POST['Professor_2']) && !empty(trim($_POST['Professor_2'])) ? trim($_POST['Professor_2']) : null;

    if ($professor2 !== null) {
        $query = "SELECT 1 FROM usuario WHERE Prontuario = ?";
        $stmt = $conexao->prepare($query);
        $stmt->bind_param("s", $professor2);
        $stmt->execute();
        $stmt->store_result();
    
        if ($stmt->num_rows === 0) {
            $_SESSION['mensagem'] = 'O segundo professor não existe, seu idiota';
        }
    
        $stmt->close();
    }
    
    if (empty($sala) || empty($curso) || empty($periodo) || empty($dia) || empty($inicio) || empty($fim) || empty($descricao)) {
        $_SESSION['mensagem'] = 'Preencha todos os campos obrigatórios!';
    } elseif (!verificarDisponibilidade($conexao, $sala, $dia, $inicio, $fim)) {
        $_SESSION['mensagem'] = 'A sala já está reservada para o horário selecionado.';
    } else {
        // Insere a reserva no banco
        $query = "INSERT INTO reserva (Sala, Curso, Periodo, Dia, Professor, Professor_2, Inicio, Fim, Descricao) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $conexao->prepare($query);

        if (!$stmt) {
            die('Erro ao preparar consulta: ' . $conexao->error);
        }

        $stmt->bind_param("sssssssss", $sala, $curso, $periodo, $dia, $professor, $professor2, $inicio, $fim, $descricao);
        if ($stmt->execute()) {
            $_SESSION['mensagem'] = 'Reserva realizada com sucesso!';
        } else {
            $_SESSION['mensagem'] = 'Erro ao realizar reserva. Tente novamente.';
        }

        $stmt->close();
    }
}

$conexao->close();
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Criar Nova Reserva</title>
    <link rel="icon" href="imagens/LogoIF.png">
    <link rel="stylesheet" href="styles/agenda.css">
    <script src="scripts/agenda.js"></script>
</head>
<body>
    <div class="container">
        <div class="header">
            <button class="back-button" onclick="voltar()">←</button>
            <h1>CRIAR NOVA RESERVA</h1>
        </div>
        <form method="POST" action="agenda.php">
            <div class="form-left">
                <label for="nome">Nome</label>
                <input type="text" id="nome" value="<?php echo htmlspecialchars($nome); ?>" readonly>
                
                <label for="dia">Dia</label>
                <!-- Campo do dia será preenchido automaticamente -->
                <input type="date" id="dia" name="Dia" required value="<?php echo isset($_POST['Dia']) ? htmlspecialchars($_POST['Dia']) : ''; ?>">

                <label for="horario">Horário</label>
                <div class="horario">
                    <span>Das</span>
                    <!-- Campo de início será preenchido automaticamente -->
                    <select id="hora-inicio" name="Inicio" required>
                    <?php
                    $horarios = range(7, 22);
                    foreach ($horarios as $hora) {
                        $minutos = ['00', '30'];
                        foreach ($minutos as $minuto) {
                            $valor = "$hora:$minuto";
                            $selected = isset($_POST['Inicio']) && $_POST['Inicio'] == $valor ? 'selected' : '';
                            echo "<option value='$valor' $selected>$valor</option>";
                        }}
                    ?>
                    </select>
                    <span>às</span>
                    <!-- Campo de término será preenchido automaticamente -->
                    <select id="hora-fim" name="Fim" required>
                    <?php
                    foreach ($horarios as $hora) {
                        foreach ($minutos as $minuto) {
                            $valor = "$hora:$minuto";
                            $selected = isset($_POST['Fim']) && $_POST['Fim'] == $valor ? 'selected' : '';
                            echo "<option value='$valor' $selected>$valor</option>";
                        }}
                    ?>
                    </select>
                </div>

                <label for="curso">Curso</label>
                <select id="curso" name="Curso" required>
                <?php
                $cursos = [
                    "EM Integrado em Administração",
                    "EM Integrado em Informática",
                    "PROEJA - Integrado em Logística",
                    "Curso Técnico em Administração",
                    "Curso Técnico em Design de Interiores",
                    "Bacharelado em Administração",
                    "Tecnologia em ADS",
                    "Tecnologia em Design de Interiores",
                    "Licenciatura em Pedagogia"
                ];
                foreach ($cursos as $curso) {
                    $selected = isset($_POST['Curso']) && $_POST['Curso'] == $curso ? 'selected' : '';
                    echo "<option value='$curso' $selected>$curso</option>";
                }
                ?>
                </select>

                <label for="periodo">Período</label>
                <select id="periodo" name="Periodo" required>
                <?php
                $periodos = [
                    "1º Ano", "2º Ano", "3º Ano", "4º Ano",
                    "1º Semestre", "2º Semestre", "3º Semestre", "4º Semestre",
                    "5º Semestre", "6º Semestre", "7º Semestre", "8º Semestre"
                ];
                foreach ($periodos as $periodo) {
                    $selected = isset($_POST['Periodo']) && $_POST['Periodo'] == $periodo ? 'selected' : '';
                    echo "<option value='$periodo' $selected>$periodo</option>";
                }
                ?>
                </select>
            </div>

            <div class="form-right">
                <label for="professor2">Nome do outro professor</label>
                <input type="text" id="professor2" name="Professor_2" placeholder="Opcional" value="<?php echo isset($_POST['Professor_2']) ? htmlspecialchars($_POST['Professor_2']) : ''; ?>">

                <label for="local">Local</label>
                <!-- Campo da sala será preenchido automaticamente -->
                <select id="local" name="Sala" required>
                <?php
                $locais = ["Ateliê", "Auditório", "Sala de Projetos", "Quadra de Esportes", "Sala de Aula 01", "Sala de Aula 02", "Sala de Aula 03", "Sala de Aula 04", "Sala de Aula 05", "Sala de Aula 06", "Sala de Aula 07", "Sala de Aula 08", "Sala de Aula 09", "Laboratório 1", "Laboratório 2", "Laboratório 3", "Laboratório 4", "Laboratório 5", "Laboratório 6", "Bloco 2 - Sala 01", "Bloco 2 - Sala 02", "Bloco 2 - Sala 03", "Bloco 2 - Sala 04"];
                foreach ($locais as $local) {
                    $selected = isset($_POST['Sala']) && $_POST['Sala'] == $local ? 'selected' : '';
                    echo "<option value='$local' $selected>$local</option>";
                }
                ?>
                </select>

                <label for="frequencia">Frequência</label>
                <select id="frequencia">
                    <option>Nenhuma</option>
                    <option>Anualmente</option>
                    <option>Mensalmente</option>
                    <option>Semanalmente</option>
                    <option>Diariamente</option>
                </select>

                <label for="descricao">Descrição</label>
                <input type="text" id="descricao" name="Descricao" placeholder="Descreva sua atividade..." value="<?php echo isset($_POST['Descricao']) ? htmlspecialchars($_POST['Descricao']) : ''; ?>">

                <button type="submit" class="btn-reservar">Reservar</button>
            </div>
        </form>
        <?php
        if (isset($_SESSION['mensagem'])) {
            echo "<p>{$_SESSION['mensagem']}</p>";
            unset($_SESSION['mensagem']);
        }
        ?>
    </div>
</body>
</html>
