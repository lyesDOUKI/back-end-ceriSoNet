const pgClient = require('pg'); 
const sha1 = require("sha1");
function getUser(request) {
    return new Promise((resolve, reject) => {
        const sql = "select * from fredouil.users where identifiant='" + request.body.username + "'; ";
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
                client.query(sql, (err, result) => {
                    console.log("executing query : " + sql)

                    if (err) {
                        console.log("Erreur d’exécution de la requete" + err.stack);
                        reject({ connect: false, response: { statusMsg: "Connexion échouée" } });
                    } else if (result.rows[0] != null && result.rows[0].motpasse == sha1(request.body.password)) {
                        request.session.isConnected = true;
                        const data = result.rows[0];
                        resolve({ connect: true, response: {
                            identifiant: result.rows[0].identifiant,
                            nom: result.rows[0].nom,
                            prenom: result.rows[0].prenom,
                            avatar: result.rows[0].avatar,
                            statut_connexion: result.rows[0].statut_connexion
                        }  });
                    } else {
                        console.log('Connexion échouée : informations de connexion incorrecte');
                        resolve({ connect: false, response: null });
                    }
                });
            }
        });
    });
}

module.exports = {
    getUser
};