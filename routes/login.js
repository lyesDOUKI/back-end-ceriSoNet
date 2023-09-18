const express = require('express');
const loginRouter = express.Router();
const PATH_TO_HTML = process.env.PATH_TO_HTML;
const file = require("fs");

loginRouter.get("/login", (req, res) => {
    file.readFile(PATH_TO_HTML, "utf8", (err) => {
        if (err)
        {
            res.status(500).send("erreur serveur lors de la lecture du fichier html");
            return;
        }
        console.log("lecture index.html OK");
        res.status(200).sendFile(PATH_TO_HTML);
    });
});

loginRouter.post('/login', (req,res) => {

    if(req.body.username && req.body.password){
        console.log("données saisies : ");
        const username = req.body.username;
        const password = req.body.password;
        console.log("username : ", username);
        console.log("password : ", password);
        res.status(200).send("login OK! bienvenue " + username);
    }else{
	    console.log("données non saisie");
    }
});

module.exports = loginRouter;