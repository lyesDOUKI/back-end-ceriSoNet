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

//recuperation des données selons critére et filtre
publicationRouter.get("/publication/:trie/:filtre", (req, res) => 
{
    console.log("dans la route publication");
    const mongodbPromise = mongodb.connect(urlMongodb);

    mongodbPromise.then((client) =>
    {
        if(client)
        {
            //console.log(client);
        }
        const db = client.db(process.env.NOM_DB);
        const collection = db.collection(process.env.NOM_COLLECTION);
        let trie = req.params.trie;
        let filtre = req.params.filtre;
        console.log("filtre : " + filtre);
        tableauHashTag = filtre.split(",");
        tableauHashTag = tableauHashTag.map(element => {
            console.log("element avant : " + element);
            element = "#" + element;
            return element;
          });
        console.log("tableauHashTag : " + tableauHashTag);
        if(trie === "date")
        {
            //filtrer par date et hashtag
                return collection.find({ hashtags: {$in:tableauHashTag} }).sort({date : -1}).toArray().then((data) => {
                    const parsedData = data.map((item) => new model.Publication(item));
        
                    console.log("nombre de poste : " + parsedData.length);
                    res.json(parsedData); // Envoyer les données parsées en réponse.
                  });
        }
        if(trie==="likes")
        {
            //trier par nombre de likes et eventuellement hashtag
            return collection.find({ hashtags: {$in:tableauHashTag} }).sort({likes : -1}).toArray().then((data) => {
                const parsedData = data.map((item) => new model.Publication(item));
    
                console.log("nombre de poste : " + parsedData.length);
                res.json(parsedData); // Envoyer les données parsées en réponse.
              });
        }
        if(trie==="comments")
        {
            
            //trier par nombre de commentaires et eventuellement hashtag
            return collection.aggregate([
                {
                    $match: {
                        hashtags: { $in: tableauHashTag }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        date: 1,
                        hour: 1,
                        body: 1,
                        createdBy: 1,
                        images: 1,
                        title: 1,
                        likes: 1,
                        hashtags: 1,
                        comments: 1,
                        commentCount: { $size: "$comments" }
                    }
                },
                {
                    $sort: { commentCount: -1 }
                }
            ]).toArray().then((data) => {
                const parsedData = data.map((item) => new model.Publication(item));
    
                console.log("nombre de poste : " + parsedData.length);
                res.json(parsedData); // Envoyer les données parsées en réponse.
              });
        }

    });
    
});

//filtrage sans hashtag
publicationRouter.get("/publication/:trie", (req, res) => 
{
    console.log("dans la route publication");
    const mongodbPromise = mongodb.connect(urlMongodb);

    mongodbPromise.then((client) =>
    {
        if(client)
        {
            //console.log(client);
        }
        const db = client.db(process.env.NOM_DB);
        const collection = db.collection(process.env.NOM_COLLECTION);
        let trie = req.params.trie;
        if(trie === "date")
        {
            //filtrer par date et hashtag
                return collection.find({}).sort({date : -1}).toArray().then((data) => {
                    const parsedData = data.map((item) => new model.Publication(item));
        
                    console.log("nombre de poste : " + parsedData.length);
                    res.json(parsedData); // Envoyer les données parsées en réponse.
                  });
        }
        if(trie==="likes")
        {
            //trier par nombre de likes et eventuellement hashtag
            return collection.find({}).sort({likes : -1}).toArray().then((data) => {
                const parsedData = data.map((item) => new model.Publication(item));
    
                console.log("nombre de poste : " + parsedData.length);
                res.json(parsedData); // Envoyer les données parsées en réponse.
              });
        }
        if(trie==="comments")
        {
            
            //trier par nombre de commentaires et eventuellement hashtag
            return collection.aggregate([
                {
                    $project: {
                        _id: 1,
                        date: 1,
                        hour: 1,
                        body: 1,
                        createdBy: 1,
                        images: 1,
                        title: 1,
                        likes: 1,
                        hashtags: 1,
                        comments: 1,
                        commentCount: { $size: "$comments" }
                    }
                },
                {
                    $sort: { commentCount: -1 }
                }
            ]).toArray().then((data) => {
                const parsedData = data.map((item) => new model.Publication(item));
    
                console.log("nombre de poste : " + parsedData.length);
                res.json(parsedData); // Envoyer les données parsées en réponse.
              });
        }

    });
    
});
module.exports = {publicationRouter};