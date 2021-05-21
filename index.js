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

    res.render("pages/index"); // wir übergebne beim rendern der index.ejs Datei, den Array gespeichert in dem key "data"
});                        
         
app.get("/hostroom", (reg, res)=> {
    res.render("pages/hostroom");
})


//app start
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
//gibt in der bash den port zurück
});
