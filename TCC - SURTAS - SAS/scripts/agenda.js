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
            const hora = `${h}h${m === 0 ? '00' : '30'}`;
            horarios.push(hora);
        }
    }

    horarios.forEach(hora => {
        const optionInicio = document.createElement('option');
        const optionFim = document.createElement('option');
        optionInicio.textContent = hora;
        optionFim.textContent = hora;
        selectInicio.appendChild(optionInicio);
        selectFim.appendChild(optionFim);
    });
}

// Função para preencher os locais disponíveis
function preencherLocais() {
    const locais = [
        "Ateliê", "Auditório", "Sala de Projetos", "Quadra de Esportes",
        "Sala de Aula 01", "Sala de Aula 02", "Sala de Aula 03", "Sala de Aula 04",
        "Sala de Aula 05", "Sala de Aula 06", "Sala de Aula 07", "Sala de Aula 08",
        "Sala de Aula 09", "Laboratório 1", "Laboratório 2", "Laboratório 3",
        "Laboratório 4", "Laboratório 5", "Laboratório 6", "Bloco 2 - Sala 01",
        "Bloco 2 - Sala 02", "Bloco 2 - Sala 03", "Bloco 2 - Sala 04"
    ];

    const selectSala = document.getElementById('sala');
    locais.forEach(local => {
        const option = document.createElement('option');
        option.textContent = local;
        selectSala.appendChild(option);
    });
}

// Chamar as funções ao carregar a página
window.onload = function() {
    gerarHorarios();
    preencherLocais();
}
