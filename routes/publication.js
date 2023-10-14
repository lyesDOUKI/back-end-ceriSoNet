const express = require('express');
const publicationRouter = express.Router();
const mongodb = require('mongodb').MongoClient;
 const model = require('../models/publication.js');
const urlMongodb = process.env.URL_MONGO;
publicationRouter.get("/publication", (req, res) => 
{
    console.log("dans la route publication");
    const mongodbPromise = mongodb.connect(urlMongodb);

    mongodbPromise.then((client) =>
    {
        if(client)
        {
            console.log(client);
        }
        const db = client.db(process.env.NOM_DB);
        const collection = db.collection(process.env.NOM_COLLECTION);

        return collection.find({}).toArray().then((data) => {
            const parsedData = data.map((item) => new model.Publication(item));

            console.log("nombre de poste : " + parsedData.length);
            res.json(parsedData); // Envoyer les données parsées en réponse.
          });
    });
    
});

module.exports = {publicationRouter};