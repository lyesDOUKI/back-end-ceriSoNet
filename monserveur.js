require("dotenv").config({ path: "./config.env" });
const express = require("express");
const PORT = process.env.PORT;
const monserveur = express();
const loginRoutes = require("./routes/login.js");
const fs = require("fs");
const https = require("https");
const bodyParser = require("body-parser");
const { Console } = require("console");
const options = {
    key: fs.readFileSync(process.env.KEY),
    cert: fs.readFileSync(process.env.CERTIFICATE),
};
////////////////////////////////////////////////////////////////////////////////
monserveur.use(express.static(process.env.ROOT));
monserveur.use(bodyParser.urlencoded({ extended : true}));
monserveur.use(bodyParser.json());
monserveur.use(loginRoutes);
https.createServer(options, monserveur).listen(PORT, () => {
    console.log("Le serveur est lancé sur le port : ", PORT);
});
