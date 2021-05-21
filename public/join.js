$(document).ready(() => {
    var user = {
        nickname: ""
    };
    $('#inputName').change(function(){
        user.nickname = $('#inputName').val();
    })
    user.nickname = read_cookie(user);
    
    console.log("DOM is ready!");
    $('btn_join').click(function () {
        var roomId = $('#inputRoom').val();

        window.location.href = "";
    });
    $('btn_host').click(function () {
        bake_cookie(user,userName);
        window.location.href = "views\pages\hostroom.ejs";
    });

    function bake_cookie(name, value) {
        var cookie = [name, '=', JSON.stringify(value), '; domain=.', window.location.host.toString(), '; path=/;'].join('');
        document.cookie = cookie;
    }
    function read_cookie(user) {
        var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
        result && (result = JSON.parse(result[1]));
        return result;
       }
});
