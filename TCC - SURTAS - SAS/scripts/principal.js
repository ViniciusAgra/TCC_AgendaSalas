$(document).ready(function() {
    const $table = $('#schedule-table');
    const startTime = 7; // 7 AM
    const endTime = 22; // 10 PM
    const locations = ["Ateliê", "Auditório", "Sala de Projetos", "Quadra de Esportes", "Sala de Aula 01", "Sala de Aula 02", "Sala de Aula 03", "Sala de Aula 04", "Sala de Aula 05", "Sala de Aula 06", "Sala de Aula 07", "Sala de Aula 08", "Sala de Aula 09", "Laboratório 1", "Laboratório 1", "Laboratório 2", "Laboratório 3", "Laboratório 4", "Laboratório 5", "Laboratório 6", "Bloco 2 - Sala 01", "Bloco 2 - Sala 02", "Bloco 2 - Sala 03", "Bloco 2 - Sala 04"];

    // Create table header with time slots
    const $theadRow = $table.find('thead tr');
    for (let hour = startTime; hour < endTime; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const time = `${hour}:${minute === 0 ? '00' : minute}`;
            $theadRow.append(`<th>${time}</th>`);
        }
    }
    // Add the final time slot header for 22:00
    $theadRow.append(`<th>22:00</th>`);

    // Create table body with locations and time slots
    const $tbody = $table.find('tbody');
    locations.forEach(location => {
        const $tr = $('<tr></tr>');
        const $tdLoc = $(`<td class="location-cell">${location}</td>`); // Added class here
        $tr.append($tdLoc);

        for (let hour = startTime; hour < endTime; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const time = `${hour}:${minute === 0 ? '00' : minute}`;
                const $td = $('<td></td>');
                const $slot = $('<div></div>')
                    .addClass('time-slot available')
                    .attr('data-time', time)
                    .attr('data-location', location)
                    .click(function() {
                        if ($(this).hasClass('available')) {
                            $(this).toggleClass('selected');
                        }
                    });
                $td.append($slot);
                $tr.append($td);
            }
        }

        // Add the final time slot cell for 21:30 - 22:00
        const finalSlotTime = '22:00';
        const $td = $('<td></td>');
        const $slot = $('<div></div>')
            .addClass('time-slot available')
            .attr('data-time', finalSlotTime)
            .attr('data-location', location)
            .click(function() {
                if ($(this).hasClass('available')) {
                    $(this).toggleClass('selected');
                }
            });
        $td.append($slot);
        $tr.append($td);

        $tbody.append($tr);
    });
});
