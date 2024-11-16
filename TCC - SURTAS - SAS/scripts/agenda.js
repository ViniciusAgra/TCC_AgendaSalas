function voltar() {
    window.location.href = 'principal.html';
}

function reservar() {
    alert("Reserva realizada com sucesso!");
}

// Função para gerar horários de meia em meia hora
function gerarHorarios() {
    const selectInicio = document.getElementById('hora-inicio');
    const selectFim = document.getElementById('hora-fim');
    const horarios = [];

    for (let h = 7; h <= 22; h++) {
        for (let m = 0; m <= 30; m += 30) {
            const hora = `${h}:${m === 0 ? '00' : '30'}`;
            horarios.push(hora);
        }
    }

    horarios.forEach(hora => {
        const optionInicio = document.createElement('option');
        const optionFim = document.createElement('option');
        optionInicio.value = hora;
        optionInicio.textContent = hora;
        optionFim.value = hora;
        optionFim.textContent = hora;
        selectInicio.appendChild(optionInicio);
        selectFim.appendChild(optionFim);
    });
}

// Função para preencher os locais disponíveis
function preencherLocais() {
    const selectLocal = document.getElementById('local');
    if (!selectLocal) {
        console.error("Elemento <select id='local'> não encontrado no DOM.");
        return;
    }
    const locais = [
        "Ateliê", "Auditório", "Sala de Projetos", "Quadra de Esportes",
        "Sala de Aula 01", "Sala de Aula 02", "Sala de Aula 03", "Sala de Aula 04",
        "Sala de Aula 05", "Sala de Aula 06", "Sala de Aula 07", "Sala de Aula 08",
        "Sala de Aula 09", "Laboratório 1", "Laboratório 2", "Laboratório 3",
        "Laboratório 4", "Laboratório 5", "Laboratório 6", "Bloco 2 - Sala 01",
        "Bloco 2 - Sala 02", "Bloco 2 - Sala 03", "Bloco 2 - Sala 04"
    ];
    
    locais.forEach(local => {
        const option = document.createElement('option');
        option.value = local;
        option.textContent = local;
        selectLocal.appendChild(option);
    });
}

// Função para preencher os campos com dados da URL
function preencherCamposComDados() {
    const params = new URLSearchParams(window.location.search);
    const horarioInicio = params.get('horarioInicio');
    const horarioFim = params.get('horarioFim');
    const local = params.get('local');
    const dataCompleta = params.get('dataCompleta');

    if (horarioInicio) {
        document.getElementById('hora-inicio').value = horarioInicio;
    }
    
    if (horarioFim) {
        document.getElementById('hora-fim').value = horarioFim;
    }

    if (local) {
        const selectLocal = document.getElementById('local');
        for (let option of selectLocal.options) {
            if (option.value === local) {
                option.selected = true;
                break;
            }
        }
    }

    if (dataCompleta) {
        // Converte de "dd/MM/yyyy" para "yyyy-MM-dd"
        const partesData = dataCompleta.split('/');
        const dataFormatada = `${partesData[2]}-${partesData[1]}-${partesData[0]}`;
        document.getElementById('dia').value = dataFormatada;
    }
    
}

// Executa as funções na ordem correta quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    gerarHorarios();      // Preenche os horários
    preencherLocais();    // Preenche os locais
    preencherCamposComDados(); // Preenche os campos com base na URL
});