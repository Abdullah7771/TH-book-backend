const express = require('express');
const router = express.Router();
const Class = require('../models/Class');
const Book = require('../models/Book');
const { body, validationResult } = require('express-validator');
var mongodb = require('mongodb');




router.get('/fetchall', async (req, res) => {
    try {
        
        const grade = await Class.aggregate([{ $sort : { grade : 1 } }]);
        res.json(grade)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})


router.get('/:grade', async (req, res) => {
    try {
        let books = await Class.find({grade : req.params.grade});
        if (!books) { return res.status(404).send("Not Found") }
        res.json(books)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})



router.get('/books/:gradeName', async (req, res) => {
    try {
        // Find the grade document by its name
        const grades = await Class.findOne({ grade: req.params.gradeName });

        if (!grades) {
            return res.status(404).send("Grade Not Found");
        }

        // Find books with the matching grade _id
        const gradeIdString = grades._id.toString()
        const books = await Book.findOne({ grade: "64eb31888555a7426fca6349"});
       console.log(gradeIdString,books)
        res.json(books);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});




router.get('/:grade/category', async (req, res) => {
    try {
        const { category } = req.body;
        let books = await Class.find({grade : req.params.grade,category:category});
        if (!books) { return res.status(404).send("Not Found") }
        res.json(books)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})


router.get('/category', async (req, res) => {
    try {
        const { category } = req.body;
        let books = await Class.find({category:category},{_id:0});
        if (!books) { return res.status(404).send("Not Found") }
        res.json(books)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})





module.exports = router