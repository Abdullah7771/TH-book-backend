const mongoose = require('mongoose');

//Connection to Cloud MongoDB Atlas
 
 //Connection to MongoDB Compass locally

const MONGOURI=process.env.DATABASE;
const connectToMongo = ()=>{
    mongoose.connect(MONGOURI, ()=>{
        console.log("Connected to Mongo Successfully");
    })
}

module.exports = connectToMongo;