const express = require('express');
const publicationRouter = express.Router();
const mongodb = require('mongodb').MongoClient;
const model = require('../models/publication.js');
const urlMongodb = process.env.URL_MONGO;
const dateUtils = require('../utils/date.js');
const ws = require('../websockets/websockets.js');
const PUBLICATION = "/publication";
publicationRouter.get(PUBLICATION, (req, res) => 
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

        return collection.find().toArray().then((data) => {
            const parsedData = data.map((item) => new model.Publication(item));

            console.log("nombre de poste : " + parsedData.length);
            res.json(parsedData); // Envoyer les données parsées en réponse.
          });
    });
    
});

publicationRouter.get('/publication/userPosts/:p1', (req, res) =>
{
    console.log("dans la route publication get posts by user id :  " + req.params.p1);
    const mongodbPromise = mongodb.connect(urlMongodb);

    mongodbPromise.then(client =>
    {
        if(client)
        {
            //console.log(client);
        }
        const db = client.db(process.env.NOM_DB);
        const collection = db.collection(process.env.NOM_COLLECTION);
        let id = req.params.p1;
        id = Number(id);
        
        return collection.find({createdBy : id}).sort({date : -1}, {hour : -1}).toArray().then((data) => {
            const parsedData = data.map((item) => new model.Publication(item));
            
            res.json(parsedData);
        });
        
    });
}
);


publicationRouter.post(PUBLICATION + "/addpost", (req, res) => 
{
    console.log("dans la route publication addpost");
    const mongodbPromise = mongodb.connect(urlMongodb);

    mongodbPromise.then(async (client) =>
    {
        if(client)
        {
            //console.log(client);
        }
        const db = client.db(process.env.NOM_DB);
        const collection = db.collection(process.env.NOM_COLLECTION);
        let body = req.body.body;
        let url = req.body.images;
        let hashtags = req.body.hashtags;
        async function getLastId()
        {
            let lastId = await collection.findOne({_id : {$type:'number'}}, {sort:{_id:-1}});
            
            return lastId._id;
        }
        let id = 0;
        id = await getLastId();
        let date = new Date();
        let formatDate = dateUtils.getDate(date);
        let formatHour = dateUtils.getHour(date);
        let createdBy = req.session.userid;
        hashtags = hashtags.map(element => {
            
            element = "#" + element;
            return element;
        });
        id = Number(id) + 1;
        
        return collection.insertOne({
            _id : id,
            date : formatDate,
            hour : formatHour,
            body : body,
            createdBy : createdBy,
            images : {url},
            likes : 0,
            hashtags : hashtags,
            comments : [],
        }).then((data) => {
            
            console.log("poste ajouté");
            ws.onAddPost(req.app.get('io'), req.session.username);
            res.json(data);
        });
    });
    
});
publicationRouter.post(PUBLICATION + "/sharepost", (req, res) =>
{
    console.log("dans la route publication pour partager le post id : " + req.body.postid);
    const mongodbPromise = mongodb.connect(urlMongodb);

    mongodbPromise.then(async (client) =>
    {
        if(client)
        {
            //console.log(client);
        }
        const db = client.db(process.env.NOM_DB);
        const collection = db.collection(process.env.NOM_COLLECTION);
        let createdBy = req.session.userid;
        let url = req.body.imageURL;
        let hashtags = req.body.hashtags;
        let date = new Date();
        let formatDate = dateUtils.getDate(date);
        let formatHour = dateUtils.getHour(date);
        let body = req.body.shareText;

        async function getLastId()
        {
            let lastId = await collection.findOne({_id : {$type:'number'}}, {sort:{_id:-1}});
            //console.log("lastId : " + JSON.stringify(lastId));
            return lastId._id;
        }
        let id = 0;
        id = await getLastId();
        id = Number(id) + 1;
        let postid = req.body.postid;
        
        return collection.insertOne({
            _id : id,
            date : formatDate,
            hour : formatHour,
            body : body,
            createdBy : createdBy,
            images : {url},
            likes : 0,
            hashtags : hashtags,
            shared : postid,
            comments : [],
        }).then((data) => {
            
            console.log("poste partagé");
            ws.onSharePost(req.app.get('io'), req.session.username);
            res.json(data);
        });

    });

}
);
publicationRouter.get(PUBLICATION + '/post/:p1', (req, res) =>
{
    console.log("dans la route publication get post by id :  " + req.params.p1);
    const mongodbPromise = mongodb.connect(urlMongodb);

    mongodbPromise.then(client =>
    {
        if(client)
        {
            //console.log(client);
        }
        const db = client.db(process.env.NOM_DB);
        const collection = db.collection(process.env.NOM_COLLECTION);
        let id = req.params.p1;
        id = Number(id);
        
        return collection.findOne({_id : id}).then((data) => {
            if(data === null)
            {
                console.log("poste non trouvé");
                res.json(null);
                return;
            }
            const parsedData = new model.Publication(data);
            console.log("poste trouvé");
            res.json(parsedData);
        });
    });
}
);
//filtrage sans hashtag
publicationRouter.get(PUBLICATION + "/:trie", (req, res) => 
{
    console.log("dans la route publication avec les tries");
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
                return collection.find({}).sort({date : -1}, {hour : -1}).toArray().then((data) => {
                    const parsedData = data.map((item) => new model.Publication(item));
        
                    
                    res.json(parsedData); // Envoyer les données parsées en réponse.
                  });
        }
        if(trie==="likes")
        {
            //trier par nombre de likes et eventuellement hashtag
            return collection.find({}).sort({likes : -1}).toArray().then((data) => {
                const parsedData = data.map((item) => new model.Publication(item));
    
                
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
    
                
                res.json(parsedData); // Envoyer les données parsées en réponse.
              });
        }

    });
    
});
//recuperation des données selons critére et filtre
publicationRouter.get(PUBLICATION + "/:trie/:filtre", (req, res) => 
{
    console.log("dans la route publication avec trie et filtre");
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
        
        tableauHashTag = filtre.split(",");
        tableauHashTag = tableauHashTag.map(element => {
            
            element = "#" + element;
            return element;
          });
        
        if(trie === "date")
        {
            //filtrer par date et hashtag
                return collection.find({ hashtags: {$in:tableauHashTag} }).sort({date : -1}, {hour : -1}).toArray().then((data) => {
                    const parsedData = data.map((item) => new model.Publication(item));
        
                    
                    res.json(parsedData); // Envoyer les données parsées en réponse.
                  });
        }
        if(trie==="likes")
        {
            //trier par nombre de likes et eventuellement hashtag
            return collection.find({ hashtags: {$in:tableauHashTag} }).sort({likes : -1}).toArray().then((data) => {
                const parsedData = data.map((item) => new model.Publication(item));
    
                
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
    
                
                res.json(parsedData); // Envoyer les données parsées en réponse.
              });
        }

    });
    
});
module.exports = {publicationRouter};