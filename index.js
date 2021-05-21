// Externe Bibliotheken
const express = require("express");
const path = require("path");

//App Initialisieren
const port = process.env.PORT || 3000;
const app = express();

// App Konfiguration 
app.use("/public", express.static(path.join(__dirname, "public")));
app.set('view engine', 'ejs'); // set ejs as view engine

//App Routen
app.get("/", (req, res) => {
    const array = [                      //Array von Usern
        {id: 1, username: "User01name", message: "MOin was geht!"}, 
        {id: 2, username: "PrinzMarkus", message: "Ich bin reich"},
        {id:3,username:"Nico", message: "Aaalles Klaaar"}
    ];
    res.render("pages/index", {data:array,}); // wir übergebne beim rendern der index.ejs Datei, den Array gespeichert in dem key "data"
});                                  

//app start
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
//gibt in der bash den port zurück
});
