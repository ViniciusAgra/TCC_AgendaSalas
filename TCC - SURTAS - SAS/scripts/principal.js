$(document).ready(function() {
    const horaInicio = 7; // 7 AM
    const horaFim = 22; // 10 PM
    const locais = ["Ateliê", "Auditório", "Sala de Projetos", "Quadra de Esportes", "Sala de Aula 01", "Sala de Aula 02", "Sala de Aula 03", "Sala de Aula 04", "Sala de Aula 05", "Sala de Aula 06", "Sala de Aula 07", "Sala de Aula 08", "Sala de Aula 09", "Laboratório 1", "Laboratório 2", "Laboratório 3", "Laboratório 4", "Laboratório 5", "Laboratório 6", "Bloco 2 - Sala 01", "Bloco 2 - Sala 02", "Bloco 2 - Sala 03", "Bloco 2 - Sala 04"];
    
    // Dias da semana abreviados em português
    const diasDaSemana = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'];
    const idsDiasDaSemana = ['agendamento-segunda', 'agendamento-terca', 'agendamento-quarta', 'agendamento-quinta', 'agendamento-sexta', 'agendamento-sabado', 'agendamento-domingo'];

    // Função para obter o início da semana a partir de uma data
    function obterInicioSemana(data) {
        const dia = data.getDay(); // 0 (Domingo) a 6 (Sábado)
        const diferenca = data.getDate() - dia + (dia === 0 ? -6 : 1); // Ajusta para segunda-feira
        return new Date(data.setDate(diferenca));
    }

    // Função para formatar a data no estilo "YYYY-MM-DD" (ideal para banco de dados)
    function formatarDataParaBD(data) {
        const ano = data.getFullYear();
        const mes = String(data.getMonth() + 1).padStart(2, '0'); // Janeiro é 0
        const dia = String(data.getDate()).padStart(2, '0');
        return `${ano}-${mes}-${dia}`;
    }

    // Função para formatar apenas o dia (para exibição)
    function formatarDia(data) {
        return data.getDate();
    }

    // Função para atualizar a exibição da semana
    function atualizarExibicaoSemana(dataInicio) {
        const inicioSemana = obterInicioSemana(dataInicio);
        const fimSemana = new Date(inicioSemana);
        fimSemana.setDate(inicioSemana.getDate() + 6);

        const textoSemana = `Seg ${formatarDia(inicioSemana)} até Dom ${formatarDia(fimSemana)}`;
        $('#exibicao-semana').text(textoSemana);

        idsDiasDaSemana.forEach((idDia, index) => {
            const diaAtual = new Date(inicioSemana);
            diaAtual.setDate(inicioSemana.getDate() + index); // Ajusta para o dia correspondente
            const dataFormatada = diaAtual.toLocaleDateString(); // Formata a data para exibir no cabeçalho
            const dataParaBD = formatarDataParaBD(diaAtual); // Formata a data para salvar no banco

            // Atualiza o cabeçalho da tabela com a data e o nome do dia abreviado
            $(`#${idDia} th:first-child`).text(`${diasDaSemana[index]} - ${dataFormatada}`);

            // Gera as células de horário com a data associada
            const $tabela = $(`#${idDia}`);
            const $corpoTabela = $tabela.find('tbody');
            $corpoTabela.empty(); // Limpa o corpo da tabela antes de adicionar as novas células

            locais.forEach(local => {
                const $linha = $('<tr></tr>');
                const $celulaLocal = $(`<td class="celula-local">${local}</td>`);
                $linha.append($celulaLocal);

                for (let hora = horaInicio; hora < horaFim; hora++) {
                    for (let minuto = 0; minuto < 60; minuto += 30) {
                        const horario = `${hora}:${minuto === 0 ? '00' : minuto}`;
                        const $celula = $('<td></td>');
                        const $slot = $('<div></div>')
                            .addClass('slot-horario disponivel')
                            .attr('data-horario', horario)
                            .attr('data-local', local)
                            .attr('data-dia', idDia)
                            .attr('data-data-completa', dataParaBD) // Atribui a data completa
                            .click(function() {
                                if ($(this).hasClass('disponivel')) {
                                    $(this).toggleClass('selecionado');
                                    // Aqui você pode adicionar lógica para capturar os dados necessários, incluindo a data completa
                                    console.log(`Data: ${dataParaBD}, Horário: ${horario}, Local: ${local}`);
                                }
                            });
                        $celula.append($slot);
                        $linha.append($celula);
                    }
                }

                // Último horário das 21:30 às 22:00
                const horarioFinal = '22:00';
                const $celulaFinal = $('<td></td>');
                const $slotFinal = $('<div></div>')
                    .addClass('slot-horario disponivel')
                    .attr('data-horario', horarioFinal)
                    .attr('data-local', local)
                    .attr('data-dia', idDia)
                    .attr('data-data-completa', dataParaBD) // Atribui a data completa para o horário final
                    .click(function() {
                        if ($(this).hasClass('disponivel')) {
                            $(this).toggleClass('selecionado');
                            // Aqui você pode capturar os dados necessários
                            console.log(`Data: ${dataParaBD}, Horário: ${horarioFinal}, Local: ${local}`);
                        }
                    });
                $celulaFinal.append($slotFinal);
                $linha.append($celulaFinal);

                $corpoTabela.append($linha);
            });
        });
    }

    // Função para gerar o cabeçalho com os horários
    function gerarCabecalhoHorarios() {
        idsDiasDaSemana.forEach(idDia => {
            const $tabela = $(`#${idDia}`);
            const $linhaCabecalho = $tabela.find('thead tr');
            $linhaCabecalho.empty(); // Limpa o cabeçalho antes de adicionar os novos horários

            // Adiciona a primeira célula vazia (para o cabeçalho de local)
            $linhaCabecalho.append('<th>Local</th>');

            // Gera o cabeçalho da tabela com os horários
            for (let hora = horaInicio; hora < horaFim; hora++) {
                for (let minuto = 0; minuto < 60; minuto += 30) {
                    const horario = `${hora}:${minuto === 0 ? '00' : minuto}`;
                    $linhaCabecalho.append(`<th>${horario}</th>`);
                }
            }
            $linhaCabecalho.append(`<th>22:00</th>`); // Último horário
        });
    }

    // Inicializa o Datepicker e modal
    $("#selecionador-data").datepicker({
        onSelect: function(textoData) {
            const dataSelecionada = new Date(textoData);
            atualizarExibicaoSemana(dataSelecionada); // Atualiza a semana com base na data selecionada

            // Fecha o modal após a seleção
            $("#modal-calendario").dialog("close");
        }
    });

    // Configura o botão de calendário para abrir o modal
    $(".botao-cabecalho img[alt='Botão Calendário']").click(function() {
        $("#modal-calendario").dialog({
            modal: true,
            width: 500,
            height: 500,
            resizable: false,
        });

        // Ajusta o tamanho do calendário
        $("#selecionador-data").css({
            'width': '100%',
            'height': '100%',
            'padding': '0',
            'margin': '0',
            'box-sizing': 'border-box',
            'font-size': '1.5em'
        });
    });

    // Exibe a semana atual ao carregar o site
    const hoje = new Date();
    gerarCabecalhoHorarios(); // Gera o cabeçalho de horários
    atualizarExibicaoSemana(hoje); // Exibe a semana atual por padrão
});
