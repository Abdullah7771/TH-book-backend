const mongoose = require('mongoose');

//Connection to Cloud MongoDB Atlas
 //const mongoURI="mongodb+srv://Usama:usamanpl1@cluster0.lhynttq.mongodb.net/Npl2023?retryWrites=true&w=majority"
 
 //Connection to MongoDB Compass locally
 //const mongoURI = "mongodb://localhost:27017/Nawait-Book?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false"
// const {MONGOURI}=require('./keys')
const MONGOURI=process.env.DATABASE;
const connectToMongo = ()=>{
    mongoose.connect(MONGOURI, ()=>{
        console.log("Connected to Mongo Successfully");
    })
}

module.exports = connectToMongo;