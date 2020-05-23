//appkey: 'h1067_1585574683417'  '_huangge_1588576755495'
$('#send-btn').on('click', e => {
    send();
})
$('#send-text').on('keydown', e => {
    let val = $('#send-text').val();
    if (val) {
        if (e.keyCode != 13) {
            return;
        }
        send();
    }
})

function send() {
    let val = $('#send-text').val();
    if (val) {
        renderDom('mine', val);
    }
    $.ajax({
        type: 'get',
        url: 'http://developer.duyiedu.com/edu/turing/chat',
        data: {
            text: val
        },
        dataType: 'json',
        success: function(res) {
            console.log(res);
            renderDom('robot', res.text);
        }
    })
    $('#send-text').val('');
}

function renderDom(who, text) {
    $(`<div class="${who}">
    <div class="picture"></div>
    <div class="text">${text}</div>
    </div>`).appendTo('.contain');
    $('.contain').scrollTop($('.contain')[0].scrollHeight - $('.contain').innerHeight());
}