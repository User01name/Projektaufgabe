$(document).ready(() => {
    var user = {
        nickname: ""
    };
    $('#inputName').change(function(){
        user.nickname = $('#inputName').val();
    })
    user.nickname = read_cookie(user);
    
   
    $('btn_join').click(function () {
        var roomId = $('#inputRoom').val();

        window.location.href = "";
    });
    $('#btn_host').click(function () {
        bake_cookie(user,userName);
        window.location.href = "http://localhost:3000/hostroom.ejs";
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


    /*
    console.log("DOM is ready!");
    var path = window.location.pathname;
    var filename = path.split("/").pop();

    if (filename == "hostroom.ejs") {
        url = "public/join.js";
        var script = document.createElement("script");
        script.src = url;
        document.head.appendChild(script);
    }
    if (filename == "index.ejs") {
        url = "public/join.js";
        var script = document.createElement("script");
        script.src = url;
        document.head.appendChild(script);
    }
    if (filename == "chessboard.ejs") {
        url = "public/join.js";
        var script = document.createElement("script");
        script.src = url;
        document.head.appendChild(script);
    }
    url = "public/join.js";
    var script = document.createElement("script");
    script.src = url;
    document.head.appendChild(script);
    */

});