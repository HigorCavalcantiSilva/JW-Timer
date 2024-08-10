socket.on('updateCountdown', (data) => {    
    const minutes = String(data.minutes).padStart(2, '0');
    const seconds = String(data.seconds).padStart(2, '0');
    document.getElementById('countdown').innerText = `${minutes}:${seconds}`;
});

socket.on('updateTalks', (data) => {
    $('#talks div').remove();
    data.times.forEach((element, idx) => {
        
        $('#talks')
            .append('<div>')
        
        $('#talks div:last')
            .append(
                $('<h3>').text(element.title)
            )
            .append(
                $('<h5>').text(`${element.time} min`)
            )
            .append(
                $('<button>', {
                    id: `btn-time-pos-${idx}`,
                    class: 'btn-talk',
                    'data-status': 0
                }).text(`Iniciar`)
            );
    });
});

$(document).on('click', '.btn-talk', function() {
    let id = $(this).attr('id');
    let id_split = id.split('-');
    let pos = id_split[id_split.length - 1];

    socket.emit('changeTalkTime', pos)
    socket.emit('start');

    if($(this).data('status') == 0) {
        $(this).text('Parar');
        $(this).data('status', 1);
    } else {
        $(this).text('Iniciar');
        $(this).data('status', 0);
        socket.emit('stop');
        socket.emit('changeTalkTime', pos)
    }

});