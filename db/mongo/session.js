const session = require('express-session'); 
const MongoDBStore = require('connect-mongodb-session')(session);

const sessionConfig = {
    secret: process.env.SECRET,
    saveUninitialized: false, 
    resave: false, 
    store : new MongoDBStore({ 
        uri: process.env.MONGO_SESSION, 
        collection: process.env.SESSION,
        touchAfter: 24 * 3600
    }),
        cookie : {
            secure: true,
            httpOnly: true,
            maxAge: 24 * 3600 * 1000,
            sameSite: 'none',
            path: '/'
            
        }
    };
module.exports = sessionConfig;