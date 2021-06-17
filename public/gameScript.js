/* Zu erledigen:
    - Siegbedingung (z.B. wenn ein bauer die andere Seite erreicht)
    - Verschicken des Arrays über Websocket, sodass beide Spieler das gleiche sehen
    - Verschiedene Spieler, verschiedene Arrays
        --> z.B. über eine Datenbank auf dem Server mit einer Spalte für die Spielernummer 
        und einer Nummer die bei einem Spieler initial 1 und bei dem anderen 2 ist 
        --> es darf immer nur der Spiler mit der Nummer 1 ziehen, beim Zugende tauschen sich die Nummern   
    - 2 Spielfigurenfarben --> zuordnung zu den Spielern und schmeißen nur möglich bei verschiedener Spielerfarbe
    - Bilder anstatt Strings verwenden und ggf. größe der Bilder anpassen (element.textContent funktioniert glaub ich nicht --> vllt element.innerHTML?)
*/

/* zuletzt hinzugefügt:
    -Baueraktionen (diagonal, 2 Felder nach vorn) --> nur für Bauern die unten starten
    -Fehlerbehebung
*/

$(document).ready(() => {
    console.log("DOM is ready!");

    var chessboardArray = new Array(8);

    //Websocket:
    const socket = io();
    var roomDiv = document.getElementById('room');
    var arrayTransport = document.getElementById('array');

    $('#messageForm').submit((event) => {
        event.preventDefault();

        socket.emit('message', $('#m').val()); //verschicke eine Nachricht in den Message Kanal
        $('#m').val(''); //leeren des Inputfeldes
    });
    //Wenn auf dem Message Kanal was kommt dann ...
    socket.on('message', function (msg) {
        $('#messages').append($('<li>').text(msg));
    });

    $('#roomForm').submit((event) => { //wenn der submit button des roomFormulars gedrückt wird ...
        event.preventDefault();
        socket.emit('room', $('#r').val()); // verschicke über den room Kanal eine Nachricht mit dem Inhalt des Textfeldes
        $('#room').html($('<h3>').text(`Room: ${$('#r').val()}`)); // und Ändere den Raumnamen
        $('#r').val('');
    });

    socket.on('room', function (msg) { //wenn man eine Nachricht von dem room kanal bekommt ...
        $('#room').html($('<h3>').text(`Room: ${$('#r').val()}`));//ändere den Text
        $('#messages').empty();
    });




    //todo 
    /*  socket.on('update', function (msg) {
         var message = messageRecive(msg);
         console.log(message);
         //chessboardArray
     });
     socket.on('update', function (msg) { //wenn man eine Nachricht von dem room kanal bekommt ...
         var ne = msg;// $('#room').html($('<h3>').text(`Room: ${$('#r').val()}`));//ändere den Text
         $('#messages').empty();
         //updateBoard
     }); */
    function sendArray() {

        socket.emit('update', chessboardArray.toString()); //verschicke eine Nachricht in den Message Kanal
    }

    //initialisieren des Spielbrettes
    const bauer = '<img src="/public/source/figuren/BauerW.png" alt="img" />';
    const turm = '<img src="/public/source/figuren/Turm.png" alt="img" />';
    const laeufer = '<img src="/public/source/figuren/Bauer.png" alt="img" />';
    const springer = '<img src="/public/source/figuren/Bauer.png" alt="img" />';
    const koenigin = '<img src="/public/source/figuren/Bauer.png" alt="img" />';
    const koenig = '<img src="/public/source/figuren/Bauer.png" alt="img" />';

    const clickedOnFieldConst = 'clickedOnField(this)';



    for (i = 0; i < chessboardArray.length; i++) {
        chessboardArray[i] = new Array(8);
    }

    function createStartArray() {
        for (i = 0; i < chessboardArray.length; i++) {
            chessboardArray[0][i] = "";
            chessboardArray[1][i] = "Bauer";
            chessboardArray[2][i] = "";
            chessboardArray[3][i] = "";
            chessboardArray[4][i] = "";
            chessboardArray[5][i] = "";
            chessboardArray[6][i] = "Bauer";
            chessboardArray[7][i] = "";
        }
        return chessboardArray;
    }

    function paint() {
        var rows = document.getElementById('chessboard').getElementsByTagName('tr');
        if (rows.length != 0) {
            document.getElementById('chessboard').innerHTML = "";
        }
        var chessboardDiv = document.getElementById('chessboard');

        farbe = '#d1cb99';

        for (z = 0; z < 8; z++) {

            var row = "<tr>";
            for (s = 0; s < 8; s++) {
                var id = "\'" + z + "," + s + "\'";
                //   row += "<td width=100 height=100 id =" + id + " bgcolor=" + farbe + " onclick=\"clickedOnField(this)\">";
                row += "<td width=100 height=100 id =" + id + " bgcolor=" + farbe + ">";
                if (chessboardArray[z][s] != undefined) {
                    row += chessboardArray[z][s];
                }
                row += "</td>";

                if (s < 7) {
                    if (farbe == '#383838') { farbe = '#d1cb99' }
                    else { farbe = '#383838'; }
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
    var selectedId;

    $("#chessboard").on("click", "td", function () { /// jqery befehl für den click

        var id = $(this).attr('id');
        clickedOnField(document.getElementById(id));
    });

    function clickedOnField(element) {

        if (!chesspieceSelected && (element.textContent !== "")) {
            selectedId = element.getAttribute("id");
            const colorSelectedField = '#7CC7FF';
            const colorOfPossibleTurn = '#7CC752';

            tileId = element.id;
            tileColor = element.getAttribute("bgcolor");
            tileContent = element.textContent

            document.getElementById(tileId).setAttribute("bgcolor", colorSelectedField);
            chesspieceSelected = true;

            switch (tileContent) {
                case 'Bauer':
                    var countOfPossibleTurns = 0;
                    var idArr = tileId.split(",");

                    idArr[0] = parseInt(idArr[0]); // Nur für den Spieler der unten ist sonst +1 todo...

                    if (idArr[0] !== 0) {
                        idOfPossibleTurns[countOfPossibleTurns] = ((idArr[0] - 1) + "," + idArr[1]);
                        countOfPossibleTurns++;
                    }

                    // wenn der Bauer auf der Startlinie ist, kann er sich 2 Felder weit bewegen
                    if (idArr[0] === 6) {
                        idOfPossibleTurns[countOfPossibleTurns] = ((idArr[0] - 2) + "," + idArr[1]);
                        countOfPossibleTurns++;
                    }
                    // wenn diagonal zum Bauer eine Figur ist, dann kann er diese schmeißen
                    if (chessboardArray[idArr[0] - 1][parseInt(idArr[1]) + 1] !== "") {
                        idOfPossibleTurns[countOfPossibleTurns] = ((idArr[0] - 1) + "," + (parseInt(idArr[1]) + 1));
                        countOfPossibleTurns++;
                    }
                    if (chessboardArray[idArr[0] - 1][parseInt(idArr[1]) - 1] !== "") {
                        idOfPossibleTurns[countOfPossibleTurns] = ((idArr[0] - 1) + "," + (parseInt(idArr[1]) - 1));
                        countOfPossibleTurns++;
                    }

                    for (var i = 0; i < idOfPossibleTurns.length; i++) {
                        console.log(idOfPossibleTurns.toString());
                        colorBeforePossibleTurns[i] = document.getElementById(idOfPossibleTurns[i]).getAttribute("bgcolor");
                        document.getElementById(idOfPossibleTurns[i]).setAttribute("bgcolor", colorOfPossibleTurn);
                    }
                    break;
                default:
                    console.log("irgendwas ist schiefgleuafen bei clickedOnField()")
            }
        } else if (chesspieceSelected) {
            if (!chesspiecePreview) {
                newTileId = element.id;
                var tileIdSplit = tileId.split(",");
                var newTileIdSplit = newTileId.split(",");
                newTileExistingContent = document.getElementById(newTileId).textContent;
                check(parseInt(tileIdSplit[0]), parseInt(tileIdSplit[1]), parseInt(newTileIdSplit[0]), parseInt(newTileIdSplit[1]), tileContent);
            }
            if (element.getAttribute("id") != null) {
                if (element.getAttribute("id") == selectedId) {
                    undoSelection();
                    selectedId = "";
                }
            }
        }
    }

    //undo
    function undoSelection() {
        //zurücksetzen der Farben
        if (chesspieceSelected) {
            document.getElementById(tileId).setAttribute("bgcolor", tileColor);
            for (var i = 0; i < idOfPossibleTurns.length; i++) {
                document.getElementById(idOfPossibleTurns[i]).setAttribute("bgcolor", colorBeforePossibleTurns[i])
            }

            idOfPossibleTurns = [];
            colorBeforePossibleTurns = [];
            chesspiecePreview = false;
            chesspieceSelected = false;
            // zurücksetzen der bewegten Figur
            document.getElementById(tileId).textContent = tileContent;
            document.getElementById(newTileId).textContent = newTileExistingContent;
            //zurücksetzen restlicher Variablen
            tileId = "";
            tileContent = "";
            newTileId = "";
            newTileExistingContent = "";
        }

    }

    function check(chessboardArrayRow, chessboardArrayCol, endPosRow, endPosCol, figur) {
        if (chessboardArrayRow > 0 && chessboardArrayCol > 0 && endPosRow < 8 && endPosCol < 8) {
            if (figur == "Bauer") {
                if ((chessboardArrayRow - endPosRow) == 1 && chessboardArrayCol - endPosCol == 0) {
                    repaint(chessboardArrayRow, chessboardArrayCol, endPosRow, endPosCol, figur);
                } else if ((chessboardArrayRow - endPosRow) == 2 && chessboardArrayCol - endPosCol == 0 && chessboardArrayRow == 6) {
                    repaint(chessboardArrayRow, chessboardArrayCol, endPosRow, endPosCol, figur);
                } else if ((chessboardArrayRow - endPosRow) == 1 && chessboardArrayCol - endPosCol == 1 || (chessboardArrayRow - endPosRow) == 1 && chessboardArrayCol - endPosCol == -1) {
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

    function updateBoard() {
        if (chesspiecePreview) {
            var idArrStartPos = tileId.split(",");
            var idArrEndPos = newTileId.split(",");
            console.log("update Chessboard" + idArrStartPos + "->" + idArrEndPos);
            chessboardArray[parseInt(idArrStartPos[0])][parseInt(idArrStartPos[1])] = "";
            chessboardArray[parseInt(idArrEndPos[0])][parseInt(idArrEndPos[1])] = tileContent;
            undoSelection();
            paint();
            chesspiecePreview = false;

        }

    }



    function messageRecive(msg) {
        console.log(msg);
        if (msg.length === 0)
            var stringArray = msg.split(",");
        for (var i = 0; i < stringArray.length; i + 2) {
            for (let index = 0; index < chessboardArray.length; index++) {
                chessboardArray[index][i] = stringArray[i];
                chessboardArray[index][i + 1] = stringArray[i + 1];
            }
        }
        paint();
    }
    $("#create").click(function () {
        createChessboard();
    });
    $("#undo").click(function () {
        undoSelection();
    });
    $("#confirm").click(function () {
        updateBoard();
        checkVictory();
        sendArray();
    });
 function checkVictory(){
    for (i = 0; i < chessboardArray.length; i++) {
       if(chessboardArray[0][i] != ""){
           window.alert("Du hast gewonnen");
           console.log("Du hast gewonnen");
       }
       if(chessboardArray[7][i] != ""){
        window.alert("Du hast verloren");
        console.log("Du hast verloren");
    }
       
        
    }
 }
    function createChessboard() {
        //window.location = "/hostroom";
        chesspieceSelected = false;
        chesspiecePreview = false;
        createStartArray();
        paint();
    }
});