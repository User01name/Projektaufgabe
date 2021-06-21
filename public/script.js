$(document).ready(() => {
    var user = {
        nickname: ""
    };
    $('#inputName').change(function () {
        document.cookie = $('#inputName').val() ;
        //user.nickname = $('#inputName').val();
    })
    //  user.nickname = read_cookie(user);


    $('btn_join').click(function () {
        var roomId = $('#inputRoom').val();
    });
    $('#btn_host').click(function () {
        location.href = "/pages/chessboard";
    });

    const a = $('a');

    a.addEventListener('click', event => {
        bake_cookie();
    });

    function bake_cookie(name, value) {
        var cookie = [name, '=', JSON.stringify(value), '; domain=.', location.host.toString(), '; path=/;'].join('');
        document.cookie = cookie;
    }
    function read_cookie(user) {
        var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
        result && (result = JSON.parse(result[1]));
        return result;
    }

});