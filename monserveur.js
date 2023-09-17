require("dotenv").config({ path: "./config.env" });
const express = require("express");
const PORT = process.env.PORT;
const monserveur = express();
const file = require("fs");
const fs = require("fs");
const https = require("https");
const PATH_TO_HTML = process.env.PATH_TO_HTML;

const options = {
    key: fs.readFileSync(process.env.KEY),
    cert: fs.readFileSync(process.env.CERTIFICATE),
};

monserveur.get("/", (req, res) => {
    console.log("redirection vers /login pour le formulaire de connexion");
    res.redirect("/login");
});

monserveur.get("/login", (req, res) => {
    file.readFile(PATH_TO_HTML, "utf8", (err) => {
        if (err)
        {
            res.status(500).send("erreur serveur lors de la lecture du fichier html");
            return;
        }
        console.log("lecture index.html OK");
        res.status(200).sendFile(PATH_TO_HTML);
    });
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