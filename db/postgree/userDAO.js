const pgClient = require('pg'); 
const sha1 = require("sha1");
const dateUtils = require('../../utils/date.js');
function getUser(request) {
    return new Promise((resolve, reject) => {
        const sql = "select * from fredouil.users where identifiant=$1;";
        const connectionObj = new pgClient.Pool({
            user: process.env.PG_ID,
            host: process.env.PG_HOST,
            database: process.env.PG_DB,
            password: process.env.PG_PWD,
            port: process.env.PG_PORT
        });

        connectionObj.connect((err, client, done) => {
            if (err) {
                console.log('Error connecting to pg server' + err.stack);
                reject({ connect: false, response: null });
            } else {
                const params = request.body.username;
                console.log('Connection established / pg db server');
                client.query(sql, [params],(err, result) => {
                    console.log("executing query with params : " + params);
                    if (err) {
                        console.log("Erreur lors de l'exécution de la requete sql, vérifiez la syntaxe" + err.stack);
                        reject({ connect: false, response: { statusMsg: "Connexion échouée" } });
                    } 
                    else if (result.rows[0] != null && result.rows[0].motpasse == sha1(request.body.password))
                    {
                        
                        request.session.isConnected = true;
                        const id = result.rows[0].id;
                        request.session.userid = id;
                        request.session.lastLogin = new Date().toISOString();
                        const date_co = new Date()
                        const date = dateUtils.getDate(date_co);
                        const heure = dateUtils.getHour(date_co);
                        const finalFormat = date + " " + heure;
                        resolve({ connect: true, response: {
                            id : result.rows[0].id,
                            identifiant: result.rows[0].identifiant,
                            nom: result.rows[0].nom,
                            prenom: result.rows[0].prenom,
                            avatar: result.rows[0].avatar,
                            statut_connexion: result.rows[0].statut_connexion,
                             date_co : finalFormat
                             }
                            });
                    } else {
                        console.log('Connexion échouée : informations de connexion incorrecte');
                        resolve({ connect: false, response: { statusMsg: "Connexion échouée" } });
                    }
                });
            }
        });
    });
}
function setStatutOnline(request) {
    return new Promise((resolve, reject) => {
        const sql = "update fredouil.users set statut_connexion = 1 where id=$1;";
        const connectionObj = new pgClient.Pool({
            user: process.env.PG_ID,
            host: process.env.PG_HOST,
            database: process.env.PG_DB,
            password: process.env.PG_PWD,
            port: process.env.PG_PORT
        });

        connectionObj.connect((err, client, done) => {
            if (err) {
                console.log('Error connecting to pg server' + err.stack);
                reject({ connect: false, response: null });
            } else {
                const params = request.session.userid;
                console.log('Connection established / pg db server');
                client.query(sql, [params],(err, result) => {
                    console.log("executing query with params : " + params);
                    if (err) {
                        console.log("Erreur lors de l'exécution de la requete sql, vérifiez la syntaxe" + err.stack);
                        reject({ connect: false, response: { statusMsg: "Connexion échouée" } });
                    } 
                    else
                    {
                       console.log("statut connexion mis à jour à 1");
                       resolve({response: {
                             message : "statut connexion mis à jour à 1"
                             }
                            });
                    } 
                });
            }
        });
    });
}
function setStatutOff(request) {
    return new Promise((resolve, reject) => {
        const sql = "update fredouil.users set statut_connexion = 0 where id=$1;";
        const connectionObj = new pgClient.Pool({
            user: process.env.PG_ID,
            host: process.env.PG_HOST,
            database: process.env.PG_DB,
            password: process.env.PG_PWD,
            port: process.env.PG_PORT
        });

        connectionObj.connect((err, client, done) => {
            if (err) {
                console.log('Error connecting to pg server' + err.stack);
                reject({ connect: false, response: null });
            } else {
                const params = request;
                console.log('Connection established / pg db server');
                client.query(sql, [params],(err, result) => {
                    console.log("executing query with params : " + params);
                    if (err) {
                        console.log("Erreur lors de l'exécution de la requete sql, vérifiez la syntaxe" + err.stack);
                        reject({ connect: false, response: { statusMsg: "Connexion échouée" } });
                    } 
                    else
                    {
                       console.log("statut connexion mis à jour à 0");
                       resolve({response: {
                             message : "statut connexion mis à jour à 0"
                             }
                            });
                    } 
                });
            }
        });
    });
}
function getUsersOn(request)
{
    return new Promise((resolve, reject) => {
        const sql = "select * from fredouil.users where statut_connexion = 1;";
        const connectionObj = new pgClient.Pool({
            user: process.env.PG_ID,
            host: process.env.PG_HOST,
            database: process.env.PG_DB,
            password: process.env.PG_PWD,
            port: process.env.PG_PORT
        });

        connectionObj.connect((err, client, done) => {
            if (err) {
                console.log('Error connecting to pg server' + err.stack);
                reject({ connect: false, response: null });
            } else {
                console.log('Connection established / pg db server');
                client.query(sql,(err, result) => {
                    if (err) {
                        console.log("Erreur lors de l'exécution de la requete sql, vérifiez la syntaxe" + err.stack);
                        reject({ connect: false, response: { statusMsg: "Connexion échouée" } });
                    } 
                    else
                    {
                       const tabUserName = [];
                          for(let i = 0; i < result.rows.length; i++)
                          {
                            tabUserName.push(result.rows[i].identifiant);
                          }
                       resolve({connect : true, response: {
                             users : tabUserName
                             }
                            });
                    } 
                });
            }
        });
    });
}
function getAllUsers(req)
{
    return new Promise((resolve, reject) => {
        const sql = "select id, identifiant, nom, prenom, avatar from fredouil.users;";
        const connectionObj = new pgClient.Pool({
            user: process.env.PG_ID,
            host: process.env.PG_HOST,
            database: process.env.PG_DB,
            password: process.env.PG_PWD,
            port: process.env.PG_PORT
        });

        connectionObj.connect((err, client, done) => {
            if (err) {
                console.log('Error connecting to pg server' + err.stack);
                reject({ connect: false, response: null });
            } else {
                
                console.log('Connection established / pg db server');
                client.query(sql,(err, result) => {
                    
                    if (err) {
                        console.log("Erreur lors de l'exécution de la requete sql, vérifiez la syntaxe" + err.stack);
                        reject({ connect: false, response: { statusMsg: "Connexion échouée" } });
                    } 
                    else if (result.rows[0] != null)
                    {
                        console.log("recuperation de la liste des utilisateurs OK");
                        resolve({ connect: true, response: {
                            listUser: result.rows 
                             }
                            });
                    } else {
                        console.log('Connexion échouée : informations de connexion incorrecte');
                        resolve({ connect: false, response: { statusMsg: "Connexion échouée" } });
                    }
                });
            }
        });
    });
};
module.exports = {
    getUser,
    setStatutOnline,
    setStatutOff,
    getUsersOn,
    getAllUsers
};
