const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');
const { body, validationResult } = require('express-validator');
var mongodb = require('mongodb');


// ROUTE 1: Get All the books using: GET "/api/books/fetchall"
router.get('/fetchall', async (req, res) => {
    try {
        
        const subject = await Subject.aggregate([{ $sort : { subject : 1 } }]);
        res.json(subject)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})


// ROUTE 1: Get the subject using number as params  : GET "/api/books/:subject"
router.get('/:subject', async (req, res) => {
    try {
        let books = await Subject.find({subject : req.params.subject});
        if (!books) { return res.status(404).send("Not Found") }
        res.json(books)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})












module.exports = router












// "name": "Chemistry",
// "subject": "Chemistry",
// "author": "Peter",
// "count": 1,
// "status": "available",
// "grade": ObjectId('')