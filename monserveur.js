require("dotenv").config({ path: "./config.env" });
const express = require("express");
const PORT = process.env.PORT;
const monserveur = express();
const loginRoutes = require("./routes/login.js");
const fs = require("fs");
const https = require("https");
const bodyParser = require("body-parser");
const options = {
    key: fs.readFileSync(process.env.KEY),
    cert: fs.readFileSync(process.env.CERTIFICATE),
};
const dateUtils = require("./utils/date.js");
const configSession = require('./db/mongo/session.js');
const session = require('express-session');

monserveur.use(session(configSession));
const cors = require('cors');
////////////////////////////////////////////////////////////////////////////////
//
monserveur.use(cors());
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

https.createServer(options, monserveur).listen(PORT, () => {
    console.log("Le serveur est lancé sur le port : ", PORT);
});
