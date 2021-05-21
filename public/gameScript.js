$(document).ready(() => {
    console.log("DOM is ready!");

    var chessboardDiv = document.getElementById('chessboard');

    farbe = '#ffffff';

    var startPos = creatStartArray();

    for (z=0;z<8;z++) {
       
       var row = "<tr>";
        for (s=0;s<8;s++){
            row+="<td width=100 height=100 bgcolor="+farbe+">";
            if(startPos [z][s] != undefined){
                row+=startPos [z][s];
            }
            row+="</td>";
            
            if(s<7){
                if( farbe == '#000000' ){ farbe = '#ffffff'}
                else{ farbe = '#000000';}
            }
        }
       
        row+= "</tr>";
        chessboardDiv.innerHTML += row;
    }

});

function creatStartArray(){
    var startPos = new Array(8);
    for(i=0; i<startPos.length; i++){
        startPos[i] = new Array(8);
    }

    for (i=0; i<startPos.length; i++){
        startPos[1][i] = "Bauer";
        startPos[6][i] = "Bauer";
    }


    return startPos;
}