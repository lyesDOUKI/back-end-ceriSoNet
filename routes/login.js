const express = require('express');
const loginRouter = express.Router();
const PATH_TO_HTML = process.env.PATH_TO_HTML;
const file = require("fs");

const userDao = require('../db/postgree/userDAO.js');
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

    /*if(req.body.username && req.body.password){
        console.log("données saisies : ");
        connect = true;
        username = req.body.username;
        password = req.body.password;
        console.log("username : ", username);
        console.log("password : ", password);    
        setTimeout(() => {
            res.redirect('/');
        }, 500);
    }else{
	    console.log("données non saisie");
    }*/
    if(req.body.username && req.body.password)
    {
    userDao.getUser(req)
    .then(({ connect, response }) => {
        if (connect) {
            console.log("Connexion réussie : ", response);
            if (response) {
                
                req.session.username = req.body.username;
                res.status(200).send(response);
            }
        } else {
            console.log("Connexion échouée");
            res.status(404).send("aucun utilisateur trouvé pour l'utilisateur : " + req.body.username);
        }
    })
    .catch(({ connect, response }) => {
        if (connect && response) {
            console.error(response.statusMsg);
        } else {
            console.error("Erreur de connexion");
        }
    });
    }
});


module.exports = {loginRouter};