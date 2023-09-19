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
const configSession = require('./db/mongo/session.js');
const session = require('express-session');
monserveur.use(session(configSession));
const cors = require('cors');
////////////////////////////////////////////////////////////////////////////////
//
monserveur.use(cors());
monserveur.use('login',express.static(process.env.ROOT));
monserveur.get("/", (req, res) => {
    console.log("connected : ", loginRoutes.isConnected());
    if(!loginRoutes.isConnected()) {
        console.log("redirecting to login");
        res.redirect("/login");
    } else {
    res.send("<h2>connected successfully! Bienvenue "+loginRoutes.getUsername()+"</h2>");
    }
});
monserveur.use(bodyParser.urlencoded({ extended : true}));
monserveur.use(bodyParser.json());
monserveur.use(loginRoutes.loginRouter);

https.createServer(options, monserveur).listen(PORT, () => {
    console.log("Le serveur est lancé sur le port : ", PORT);
});
