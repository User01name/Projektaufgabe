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

var startPos = new Array(8);
for(i=0; i<startPos.length; i++){
    startPos[i] = new Array(8);
}

function createStartArray(){
    for (i=0; i<startPos.length; i++){
        startPos[1][i] = "Bauer";
        startPos[6][i] = "Bauer";
    }
    return startPos;
}

function paint(){
    var chessboardDiv = document.getElementById('chessboard');

    farbe = '#ccbf8e';

    for (z=0;z<8;z++) {
       
       var row = "<tr>";
        for (s=0;s<8;s++){
            row+="<td width=100 height=100 bgcolor="+farbe+">";
            if(startPos [z][s] != undefined){
                row+=startPos [z][s];
            }
            row+="</td>";
            
            if(s<7){
                if( farbe == '#976344' ){ farbe = '#ccbf8e'}
                else{ farbe = '#976344';}
            }
        }
       
        row+= "</tr>";
        chessboardDiv.innerHTML += row;
    }

}

function repaint(startPosRow, startPosCol, endPosRow, endPosCol, figur){
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

function exampleTurn(){
    startPos [1][1] = "";
    startPos [3][1] = "Bauer";
    repaint(1,1,3,1,"Bauer");
    //      rows[i].addEventListener('click', function() {
      //  alert(this.rowIndex + 1);
    //});
}