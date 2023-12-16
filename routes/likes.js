const express = require('express');
const likesRouter = express.Router();
const ws = require('../websockets/websockets.js');
const mongodb = require('mongodb').MongoClient;
const model = require('../models/publication.js');
const PUBLICATION = "/publication";
likesRouter.post(PUBLICATION + "/likes", (req, res) =>
    {
        console.log("dans la route likes");
        const mongodbPromise = mongodb.connect(process.env.URL_MONGO);

        mongodbPromise.then((client) =>
        {
            if(client)
            {
                //console.log(client);
                console.log("connexion à la base de données réussie");
            }
            const db = client.db(process.env.NOM_DB);
            const collection = db.collection(process.env.NOM_COLLECTION);
            let id = req.body.id;
            
            id = Number(id);
            return collection.updateOne({ _id: id }, { $inc: { likes: 1 } }).then((data) => {
                //retourner le post de _id
                //find by id
                collection.find({ _id: id }).toArray().then((data) => {
                    
                    
                    const parsedData = data.map((item) => new model.Publication(item));
                    const post = parsedData[0];
                    const dataToEmit = req.session.username;
                    ws.onLike(req.app.get('io'), dataToEmit);
                    res.json(post); // Envoyer les données parsées en réponse.
                });
              });
        });
    }
);
module.exports = {likesRouter};