require("dotenv").config({ path: "./config.env" });
const express = require("express");
const PORT = process.env.PORT;
const monserveur = express();
const loginRoutes = require("./routes/login.js");
const publicationRoute = require('./routes/publication.js');
const fs = require("fs");
const https = require("https");
const bodyParser = require("body-parser");
const options = {
    key: fs.readFileSync(process.env.KEY),
    cert: fs.readFileSync(process.env.CERTIFICATE),
};
const cors = require('cors');

const dateUtils = require("./utils/date.js");
const configSession = require('./db/mongo/session.js');
const session = require('express-session');
monserveur.use(session(configSession));
//configuration des headers et le cross origin et l'envoi des cookies et sessions
monserveur.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://192.168.2.13:3206');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // Permet l'envoi de cookies
  next();
});

const app = https.createServer(options, monserveur);

const io = require('socket.io')(app,
    {
        cors : {}
    });
monserveur.set('io', io);
////////////////////////////////////////////////////////////////////////////////
//

monserveur.use('login',express.static(process.env.ROOT));
monserveur.get("/", (req, res) => {
    if("isConnected" in req.session){
        if(!req.session.isConnected) {
            console.log("redirecting to login");
            res.redirect("/login");
        } else {
            console.log ("connected : " + req.session.isConnected);
            const lastLogin = new Date(req.session.lastLogin);
            console.log("utilisateur : " + req.session.username +" date de dernière connexion : " + dateUtils.getHour(lastLogin));
            console.log("utilisateur : " + req.session.username +" heure de dernière connexion : " + dateUtils.getDate(lastLogin));
            res.send("<h2>connected successfully! Bienvenue "+req.session.username+"</h2>");
        }
    }else{
        console.log("redirecting to login, no connected session");
        res.redirect("/login");
    }
    
});
monserveur.use(bodyParser.urlencoded({ extended : true}));
monserveur.use(bodyParser.json());
monserveur.use(loginRoutes.loginRouter);
monserveur.use(publicationRoute.publicationRouter);
app.listen(PORT, () => {
    console.log("Le serveur est lancé sur le port : ", PORT);
});
