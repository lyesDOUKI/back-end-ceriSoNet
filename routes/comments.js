const express = require('express');
const commentsRouter = express.Router();
const ws = require('../websockets/websockets.js');
const mongodb = require('mongodb').MongoClient;
const model = require('../models/publication.js');


commentsRouter.post("/comments", (req, res) =>
{
    console.log("dans la route comments");
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
        //id publication
        let _id = req.body._id;
        console.log("id utilisateur : " + req.session.userid);
        const comment = {
            text : req.body.text,
            commentedBy : req.session.userid,
            date : req.body.date,
            hour : req.body.hour
        };
        _id = Number(_id);
        return collection.updateOne({ _id: _id }, { $push: { comments: comment } }).then((data) => {
            //retourner le post de _id
            //find by id
            collection.find({ _id: _id }).toArray().then((data) => {
                console.log("data : " + data.length);
                
                const parsedData = data.map((item) => new model.Publication(item));
                const post = parsedData[0];
                const dataToEmit = req.session.username;
                ws.onComment(req.app.get('io'), dataToEmit);
                console.log("post : " + JSON.stringify(post));
                res.json(post); // Envoyer les données parsées en réponse.
            });
          });
    });
}
);
module.exports = {commentsRouter};