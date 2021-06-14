$(document).ready(() => {
    console.log("DOM is ready!");


    //Websocket:
    const socket = io();
    var roomDiv = document.getElementById('room');

    $('#roomForm').submit((event) => { //wenn der submit button des roomFormulars gedrückt wird ...
        event.preventDefault();
        socket.emit('room', $('#r').val()); // verschicke über den room Kanal eine Nachricht mit dem Inhalt des Textfeldes
        roomDiv.innerHTML += `Room: ${$('#r').val()}`; // und Ändere den Raumnamen
        $('#r').val('');
    });

    socket.on('room', function (msg) { //wenn man eine Nachricht von dem room kanal bekommt ...
        roomDiv.innerHTML += `Room: ${msg}`;//ändere den Text    
    });

});
const bauer = '<img src="/public/source/figuren/Bauer.png" alt="img" />';
const turm = '<img src="/public/source/figuren/Turm.png" alt="img" />';
const laeufer = '<img src="/public/source/figuren/Bauer.png" alt="img" />';
const springer = '<img src="/public/source/figuren/Bauer.png" alt="img" />';
const koenigin = '<img src="/public/source/figuren/Bauer.png" alt="img" />';
const koenig = '<img src="/public/source/figuren/Bauer.png" alt="img" />';
var startPos = new Array(8);
for (i = 0; i < startPos.length; i++) {
    startPos[i] = new Array(8);
}

function createStartArray() {
    for (i = 0; i < startPos.length; i++) {
        startPos[1][i] = "Bauer";
        startPos[6][i] = "Bauer";
    }
    return startPos;
}

function paint() {
    var rows = document.getElementById('chessboard').getElementsByTagName('tr');
    if (rows.length != 0) {
        document.getElementById('chessboard').innerHTML = "";
    }
    var chessboardDiv = document.getElementById('chessboard');

    farbe = '#ccbf8e';

    for (z = 0; z < 8; z++) {

        var row = "<tr>";
        for (s = 0; s < 8; s++) {
            row += "<td width=100 height=100 bgcolor=" + farbe + ">";
            if (startPos[z][s] != undefined) {
                row += startPos[z][s];
            }
            row += "</td>";

            if (s < 7) {
                if (farbe == '#976344') { farbe = '#ccbf8e' }
                else { farbe = '#976344'; }
            }
        }

        row += "</tr>";
        chessboardDiv.innerHTML += row;
    }

}
function check(startPosRow, startPosCol, endPosRow, endPosCol, figur) {
    if (startPosRow > 0 && startPosCol > 0 && endPosRow < 8 && endPosCol < 8) {
        if (figur == "bauer") {
            if ((startPosRow - endPosRow) == 1 && startPosCol - endPosCol == 0) {
                repaint(startPosRow, startPosCol, endPosRow, endPosCol, figur);
            }
        }
        else if (figur == "turm") {
            if (((startPosRow - endPosRow) != 0 && (startPosCol - endPosCol) == 0) || ((startPosRow - endPosRow) == 0 && (startPosCol - endPosCol) != 0)) {
                repaint(startPosRow, startPosCol, endPosRow, endPosCol, figur);
            }
        }
        else if (figur == "springer") {
            if ((((startPosRow - endPosRow) == 3 || (startPosRow - endPosRow) == -3) && ((startPosCol - endPosCol) == 1 || (startPosCol - endPosCol) == -1)) ||
                (((startPosRow - endPosRow) == 1 || (startPosRow - endPosRow) == -1) && ((startPosCol - endPosCol) == 3 || (startPosCol - endPosCol) == -3))
            ) { repaint(startPosRow, startPosCol, endPosRow, endPosCol, figur); }
        }
        else if (figur == "laeufer") {
            var a = (startPosRow - endPosRow);
            var b = (startPosCol - endPosCol);
            a = a * a;
            b = b * b;
            if (a == b) {
                repaint(startPosRow, startPosCol, endPosRow, endPosCol, figur);
            }
        }
        else if (figur == "koenigin") {
            var a = (startPosRow - endPosRow);
            var b = (startPosCol - endPosCol);
            a = a * a;
            b = b * b;
            if ((a == b) || ((startPosRow - endPosRow) != 0 && (startPosCol - endPosCol) == 0) || ((startPosRow - endPosRow) == 0 && (startPosCol - endPosCol) != 0)) {
                repaint(startPosRow, startPosCol, endPosRow, endPosCol, figur);
            }
        }
        else if (figur == "koenig") {
            if (((startPosRow - endPosRow) == 1 || (startPosRow - endPosRow) == -1) && (startPosCol - endPosCol) == 0) {
                repaint(startPosRow, startPosCol, endPosRow, endPosCol, figur);
            }
            if (((startPosCol - endPosCol) == 1 || (startPosCol - endPosCol) == -1) && (startPosRow - endPosRow) == 0) {
                repaint(startPosRow, startPosCol, endPosRow, endPosCol, figur);
            }
        }
    }
}

function repaint(startPosRow, startPosCol, endPosRow, endPosCol, figur) {
    var rows = document.getElementById('chessboard').getElementsByTagName('tr');
    var data = rows[startPosRow].getElementsByTagName('td');
    data[startPosCol].innerHTML = "";

    data = rows[endPosRow].getElementsByTagName('td');
    data[endPosCol].innerHTML = figur;
}

function clickFun() {
    //window.location = "/hostroom";
    createStartArray();
    paint();

}

function exampleTurn() {
    startPos[1][1] = bauer;
    startPos[3][1] = bauer;
    repaint(1, 1, 3, 1, "bauer");
    //      rows[i].addEventListener('click', function() {
    //  alert(this.rowIndex + 1);
    //});
}