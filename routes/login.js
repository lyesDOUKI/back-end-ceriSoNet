const express = require('express');
const loginRouter = express.Router();
const PATH_TO_HTML = process.env.ROOT + '/index.html';
const file = require("fs");
const userDao = require('../db/postgree/userDAO.js');
const ws = require('../websockets/websockets.js');
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

loginRouter.get("/getAllUsers", (req, res)=>
{
    userDao.getAllUsers(req).then(({ connect, response }) => {
        res.status(200).send(response.listUser);
    })
}   
);

loginRouter.post('/login', (req,res) => {
    if(req.body.username && req.body.password)
    {
        console.log("username : " + req.body.username);
        console.log("mot de passe : " + req.body.password);
	    userDao.getUser(req).then(({ connect, response }) => {
        if (connect) {
            ws.onLogin(req.app.get('io'), response);
            ws.onFirstConnect(req.app.get('io'), response);
            console.log("Connexion réussie : ", response);
            if (response) {
                userDao.setStatutOnline(req).then(({ response }) => {
                    console.log("statut connexion mis à jour");
                    
                });
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
   const tmpUsername = req.session.username;
   const tmpId = req.session.userid;
   userDao.setStatutOff(tmpId).then(({ response }) => {
    console.log("statut connexion mis à jour");
    
});
   req.session.destroy((err) => {
       if(err)
       {
           console.error("erreur lors de la déconnexion : " + err.stack);
           res.status(500).send("erreur lors de la déconnexion");
       }
       else
       {
            ws.onLogout(req.app.get('io'), tmpUsername);
           console.log("déconnexion réussie");
           
           res.status(200).send();
       }
   });
    
});
loginRouter.get('/usersOn', (req, res) => {
    userDao.getUsersOn().then(({ connect, response }) => {
        console.log("connecte : " + connect);
        if (connect) {
            console.log("liste des utilisateurs connectés : ", response);
            res.status(200).send(response.users);
        } else {
            console.log(response.users);
            res.status(404).send("aucun utilisateur trouvé");
        }
    })
    .catch(({ connect, response }) => {
        if (connect && response) {
            console.error(response.statusMsg);
        } else {
            console.error("Erreur de connexion");
        }
    });
})
module.exports = {loginRouter};
