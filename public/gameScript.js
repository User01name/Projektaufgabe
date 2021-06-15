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
//initialisieren des Spielbrettes
const bauer = '<img src="/public/source/figuren/Bauer.png" alt="img" />';
const turm = '<img src="/public/source/figuren/Turm.png" alt="img" />';
const laeufer = '<img src="/public/source/figuren/Bauer.png" alt="img" />';
const springer = '<img src="/public/source/figuren/Bauer.png" alt="img" />';
const koenigin = '<img src="/public/source/figuren/Bauer.png" alt="img" />';
const koenig = '<img src="/public/source/figuren/Bauer.png" alt="img" />';

const clickedOnFieldConst = 'clickedOnField(this)';

var chessboardArray = new Array(8);
var chessboardArrayCopy = chessboardArray;

for (i = 0; i < chessboardArray.length; i++) {
    chessboardArray[i] = new Array(8);
}

function createStartArray() {
    for (i = 0; i < chessboardArray.length; i++) {
        chessboardArray[1][i] = "Bauer";
        chessboardArray[6][i] = "Bauer";
    }
    return chessboardArray;
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
            var id = "\'" + z + "," + s + "\'"; 
            row += "<td width=100 height=100 id =" + id + " bgcolor=" + farbe + " onclick=\"clickedOnField(this)\">";
            if (chessboardArray[z][s] != undefined) {
                row += chessboardArray[z][s];
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
// Beim Clicken auf ein Schachfeld:
var chesspieceSelected = false;
var chesspiecePreview = false;
var tileId;
var tileColor;
var tileContent;
var idOfPossibleTurns = []; //Array with all ids of possible turns with current selected Unit
var colorBeforePossibleTurns = []; //and the corresponding color of the tiles
//new Tile of the unit
var newTileId;
var newTileExistingContent;

function clickedOnField(element){
    if(!chesspieceSelected && (element.textContent !== "")){
        const colorSelectedField = '#7CC7FF';
        const colorOfPossibleTurn = '#7CC752' ;

        tileId = element.id;
        tileColor = element.getAttribute("bgcolor");
        tileContent = element.textContent
        
        document.getElementById(tileId).setAttribute("bgcolor",colorSelectedField);
        chesspieceSelected = true;

        switch (tileContent){
            case 'Bauer':
                var idArr = tileId.split(",");
                idArr [0] = parseInt(idArr[0]) -1; // Nur für den Spieler der unten ist sonst +1 todo...

                idOfPossibleTurns[0] = (idArr[0] + "," + idArr[1]);
                for(var i = 0; i<idOfPossibleTurns.length; i++){
                    colorBeforePossibleTurns[i] = document.getElementById(idOfPossibleTurns[i]).getAttribute("bgcolor");
                    document.getElementById(idOfPossibleTurns[i]).setAttribute("bgcolor",colorOfPossibleTurn);
                }
                break;
            default:
                console.log("irgendwas ist schiefgleuafen bei clickedOnField()")
        }
    } else if(chesspieceSelected) {
        if(!chesspiecePreview){
             newTileId = element.id;
             var tileIdSplit = tileId.split(",");
             var newTileIdSplit = newTileId.split(",");
             newTileExistingContent = document.getElementById(newTileId).textContent;
             check(parseInt(tileIdSplit[0]),parseInt(tileIdSplit[1]),parseInt(newTileIdSplit[0]),parseInt(newTileIdSplit[1]),tileContent);
        }
    }   
}

//undo
function undoSelection(){
    //zurücksetzen der Farben
    if(chesspieceSelected){  
        document.getElementById(tileId).setAttribute("bgcolor",tileColor);
        for(var i=0; i<idOfPossibleTurns.length;i++){
            document.getElementById(idOfPossibleTurns[i]).setAttribute("bgcolor",colorBeforePossibleTurns[i])
        }

        idOfPossibleTurns = [];
        colorBeforePossibleTurns = [];
        chesspiecePreview = false;
        chesspieceSelected = false;
    // zurücksetzen der bewegten Figur
        document.getElementById(tileId).textContent = tileContent;
        document.getElementById(newTileId).textContent = newTileExistingContent;
    }

}

function check(chessboardArrayRow, chessboardArrayCol, endPosRow, endPosCol, figur) {
    if (chessboardArrayRow > 0 && chessboardArrayCol > 0 && endPosRow < 8 && endPosCol < 8) {
        if (figur == "Bauer") {
            if ((chessboardArrayRow - endPosRow) == 1 && chessboardArrayCol - endPosCol == 0) {
                repaint(chessboardArrayRow, chessboardArrayCol, endPosRow, endPosCol, figur);
            }
        }
        else if (figur == "Turm") {
            if (((chessboardArrayRow - endPosRow) != 0 && (chessboardArrayCol - endPosCol) == 0) || ((chessboardArrayRow - endPosRow) == 0 && (chessboardArrayCol - endPosCol) != 0)) {
                repaint(chessboardArrayRow, chessboardArrayCol, endPosRow, endPosCol, figur);
            }
        }
        else if (figur == "Springer") {
            if ((((chessboardArrayRow - endPosRow) == 3 || (chessboardArrayRow - endPosRow) == -3) && ((chessboardArrayCol - endPosCol) == 1 || (chessboardArrayCol - endPosCol) == -1)) ||
                (((chessboardArrayRow - endPosRow) == 1 || (chessboardArrayRow - endPosRow) == -1) && ((chessboardArrayCol - endPosCol) == 3 || (chessboardArrayCol - endPosCol) == -3))
            ) { repaint(chessboardArrayRow, chessboardArrayCol, endPosRow, endPosCol, figur); }
        }
        else if (figur == "Laeufer") {
            var a = (chessboardArrayRow - endPosRow);
            var b = (chessboardArrayCol - endPosCol);
            a = a * a;
            b = b * b;
            if (a == b) {
                repaint(chessboardArrayRow, chessboardArrayCol, endPosRow, endPosCol, figur);
            }
        }
        else if (figur == "Koenigin") {
            var a = (chessboardArrayRow - endPosRow);
            var b = (chessboardArrayCol - endPosCol);
            a = a * a;
            b = b * b;
            if ((a == b) || ((chessboardArrayRow - endPosRow) != 0 && (chessboardArrayCol - endPosCol) == 0) || ((chessboardArrayRow - endPosRow) == 0 && (chessboardArrayCol - endPosCol) != 0)) {
                repaint(chessboardArrayRow, chessboardArrayCol, endPosRow, endPosCol, figur);
            }
        }
        else if (figur == "Koenig") {
            if (((chessboardArrayRow - endPosRow) == 1 || (chessboardArrayRow - endPosRow) == -1) && (chessboardArrayCol - endPosCol) == 0) {
                repaint(chessboardArrayRow, chessboardArrayCol, endPosRow, endPosCol, figur);
            }
            if (((chessboardArrayCol - endPosCol) == 1 || (chessboardArrayCol - endPosCol) == -1) && (chessboardArrayRow - endPosRow) == 0) {
                repaint(chessboardArrayRow, chessboardArrayCol, endPosRow, endPosCol, figur);
            }
        }
    }
}

function repaint(chessboardArrayRow, chessboardArrayCol, endPosRow, endPosCol, figur) {
    var rows = document.getElementById('chessboard').getElementsByTagName('tr');
    var data = rows[chessboardArrayRow].getElementsByTagName('td');
    data[chessboardArrayCol].innerHTML = "";

    data = rows[endPosRow].getElementsByTagName('td');
    data[endPosCol].innerHTML = figur;
    chesspiecePreview = true;
}

function updateBoard(){
    //todo...
}

function createChessboard() {
    //window.location = "/hostroom";
    chesspieceSelected = false;
    chesspiecePreview = false;
    createStartArray();
    paint();
}

function exampleTurn() {
    chessboardArray[1][1] = bauer;
    chessboardArray[3][1] = bauer;
    repaint(1, 1, 3, 1, "bauer");
    //      rows[i].addEventListener('click', function() {
    //  alert(this.rowIndex + 1);
    //});
}