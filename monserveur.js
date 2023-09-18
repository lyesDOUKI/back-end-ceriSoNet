require("dotenv").config({ path: "./config.env" });
const express = require("express");
const PORT = process.env.PORT;
const monserveur = express();
const file = require("fs");
const fs = require("fs");
const https = require("https");
const PATH_TO_HTML = process.env.PATH_TO_HTML;
const HTML = process.env.HTML;
const options = {
    key: fs.readFileSync(process.env.KEY),
    cert: fs.readFileSync(process.env.CERTIFICATE),
};

monserveur.use(express.static(__dirname + PATH_TO_HTML));

monserveur.all("/", (req, res) => {
    console.log("redirection vers /login pour le formulaire de connexion");
    res.redirect("/login");
});

monserveur.get("/login", (req, res) => {
    
    res.sendFile(__dirname + PATH_TO_HTML + HTML)
    if(req.query.username && req.query.password){
        const username = req.query.username;
        const password = req.query.password;
        console.log("username : ", username);
        console.log("password : ", password);
    }
});

monserveur.get("/test", (req, res) => {
    console.log("testing route /test");
    res.status(200).send("test route/test OK!");
});


https.createServer(options, monserveur).listen(PORT, () => {
    console.log("Le serveur est lancé sur le port : ", PORT);
});