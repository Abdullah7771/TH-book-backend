const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');
const { body, validationResult } = require('express-validator');
var mongodb = require('mongodb');


router.get('/fetchall', async (req, res) => {
    try {
        
        const subject = await Subject.aggregate([{ $sort : { subject : 1 } }]);
        res.json(subject)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})


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












