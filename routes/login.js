const express = require('express');
const loginRouter = express.Router();
const PATH_TO_HTML = process.env.PATH_TO_HTML;
const file = require("fs");
const userDao = require('../db/postgree/userDAO.js');
const ws = require('../websockets/wesockets.js');
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
    if(req.body.username && req.body.password)
    {
	    userDao.getUser(req).then(({ connect, response }) => {
        if (connect) {
            ws.onLogin(req.app.get('io'), response);
            console.log("Connexion réussie : ", response);
            if (response) {
                
                req.session.username = req.body.username;
                res.status(200).send(response);
            }
        } else {
            console.log(response);
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

loginRouter.post('/logout', (req, res) => {
    
   console.log("déconnexion de l'utilisateur : " + req.session.username) 
   req.session.destroy((err) => {
       if(err)
       {
           console.error("erreur lors de la déconnexion : " + err.stack);
           res.status(500).send("erreur lors de la déconnexion");
       }
       else
       {
           console.log("déconnexion réussie");
           res.status(200).send();
       }
   });
    
});

module.exports = {loginRouter};
