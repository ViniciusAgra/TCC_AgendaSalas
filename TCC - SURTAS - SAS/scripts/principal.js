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
                            .attr('data-data-completa', dataParaBD)
                            .on('mousedown', iniciarSelecao);

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
                    .attr('data-data-completa', dataParaBD)
                    .on('mousedown', iniciarSelecao);

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

    // Novo código para interação com células selecionáveis
    let isSelecting = false;
    let isAddingSelection = true;
    let linhaSelecionada = null;

    function iniciarSelecao(e) {
        e.preventDefault();
        if ($('#popup-confirmacao').length > 0) return; // Bloqueia a interação se o pop-up estiver aberto
        isSelecting = true;
        isAddingSelection = !$(this).hasClass('selecionado');
        $(this).toggleClass('selecionado', isAddingSelection);
        selectedSlots = [$(this)];
        linhaSelecionada = $(this).closest('tr').index(); // Armazena a linha da célula inicial
    }

    $(document).on('mousemove', '.slot-horario.disponivel', function() {
        if (isSelecting) {
            const linhaAtual = $(this).closest('tr').index();
            if (linhaAtual === linhaSelecionada) { // Permite a seleção apenas na linha inicial
                $(this).toggleClass('selecionado', isAddingSelection);
                if (isAddingSelection) {
                    selectedSlots.push($(this));
                }
            }
        }
    });

    $(document).on('mouseup', function() {
        if (isSelecting) {
            isSelecting = false;
            if (isAddingSelection && selectedSlots.length > 0) {
                mostrarPopupConfirmacao();
            }
        }
    });

    function mostrarPopupConfirmacao() {
        const popup = $('<div id="popup-confirmacao" class="popup-verde">');
        const botaoConfirmar = $('<button class="botao-confirmar"><img src="imagens/correto.png" alt="Botão Confirma" class="botao-popup"></button>');
        const botaoCancelar = $('<button class="botao-cancelar"><img src="imagens/incorreto.png" alt="Botão Exclui" class="botao-popup"></button>');
    
        popup.append(botaoCancelar, botaoConfirmar); // Adiciona os dois botões ao pop-up
        $('body').append(popup);
    
        // Bloquear interações com a tabela
        $('.slot-horario').css('pointer-events', 'none');
    
        // Exibir o pop-up
        popup.show();
    
        // Evento para cancelar a seleção
        botaoCancelar.click(function() {
            desfazerSelecao();
        });
        
    
        // Evento para confirmar a seleção
        botaoConfirmar.click(function() {
            enviarDadosParaAgenda();
        });
    }

    function desfazerSelecao() {
        selectedSlots.forEach(slot => slot.removeClass('selecionado'));
        selectedSlots = [];
        $('#popup-confirmacao').remove(); // Remove o pop-up se estiver aberto
        $('.slot-horario').css('pointer-events', 'auto'); // Restaura a interação com a tabela
    }

    function enviarDadosParaAgenda() {
        if (!selectedSlots[0] || !selectedSlots[0].get(0)) {
            alert('Nenhuma célula válida selecionada.');
            return;
        }
    
        const horarioInicio = obterHorarioInicio();
        console.log('Horário de início:', horarioInicio);
    
        const horarioFim = calcularHorarioFim(obterHorarioFim());
        console.log('Horário de fim:', horarioFim);
    
        const local = selectedSlots[0]?.get(0)?.dataset.local || '';
        console.log('Local:', local);
    
        const dataCompleta = formatarData(selectedSlots[0]?.get(0)?.dataset.dataCompleta || '');
        console.log('Data completa:', dataCompleta);
    
        if (horarioInicio && horarioFim && local && dataCompleta) {
            const urlParams = new URLSearchParams({
                horarioInicio,
                horarioFim,
                local,
                dataCompleta
            });
    
            console.log('URL gerado:', `agenda.php?${urlParams.toString()}`);
            window.location.href = `agenda.php?${urlParams.toString()}`;
        } else {
            alert('Por favor, selecione corretamente as células antes de confirmar!');
        }
    }

    function obterHorarioInicio() {
        return selectedSlots[0]?.attr('data-horario') || '';
    }
    
    function obterHorarioFim() {
        return selectedSlots[selectedSlots.length - 1]?.attr('data-horario') || '';
    }
    
    function calcularHorarioFim(horario) {
        // Retorna exatamente o horário passado, sem alterações
        return horario;
    }

    function formatarData(data) {
        const [ano, mes, dia] = data.split('-');
        return `${dia}/${mes}/${ano}`;
    }
});