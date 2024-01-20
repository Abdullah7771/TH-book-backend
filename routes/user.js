const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Book = require('../models/Book');
const OrderedBooks=require('../models/OrderedBooks');
const fetchuser=require("../middleware/fetchuser")
const { body, validationResult } = require('express-validator');
var mongodb = require('mongodb');



/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User-related endpoints
 */


 


/**
 * @swagger
 * paths:
 *   /api/users/fetchall:
 *     get:
 *       tags:
 *         - Users
 *       description: Returns a list of all  users
 *       parameters:
 *         - in: header
 *           name: auth-token
 *           schema:
 *             type: string
 *           required: true
 *           description: An authentication token
 *       security:
 *         - auth-token: []
 *       responses:
 *         '200':
 *           description: A list of users
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Users'
 */



router.get('/fetchall',fetchuser, async (req, res) => {
    try {
        const users = await User.find();
        res.json(users)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})





/**
 * @swagger
 * paths:
 *   /api/users/admin:
 *     get:
 *       tags:
 *         - Users
 *       description: Returns a list of users that are admin
 *       parameters:
 *         - in: header
 *           name: auth-token
 *           schema:
 *             type: string
 *           required: true
 *           description: An authentication token
 *       security:
 *         - auth-token: []
 *       responses:
 *         '200':
 *           description: A list of admin users
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Users'
 */

router.get('/admin',fetchuser, async (req, res) => {
    try {
        const users = await User.find({accountType : 'Admin'},);
        res.json(users)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})





/**
 * @swagger
 * paths:
 *   /api/users/user:
 *     get:
 *       tags:
 *         - Users
 *       description: Returns a list of users
 *       parameters:
 *         - in: header
 *           name: auth-token
 *           schema:
 *             type: string
 *           required: true
 *           description: An authentication token
 *       security:
 *         - auth-token: []
 *       responses:
 *         '200':
 *           description: A list of users
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Users'
 */

router.get('/user', async (req, res) => {
    try {
        const users = await User.find({accountType : 'User'},);
        res.json(users)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})






/**
 * @swagger
 * paths:
 *   /api/users/name/{name}:
 *     get:
 *       summary: Get users by name.
 *       tags: [Users]
 *       parameters:
 *         - in: query
 *           name: name
 *           required: true
 *           description: Name of the user to retrieve.
 *           schema:
 *             type: string
 *         - in: header
 *           name: auth-token
 *           schema:
 *             type: string
 *           required: true
 *           description: An authentication token to access the API.
 *       security:
 *         - auth-token: []
 *       responses:
 *         '200':
 *           description: A list of users with the specified name.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/UserWithBooks'
 *         '500':
 *           description: Internal Server Error.
 */



router.get('/name/',fetchuser, async (req, res) => {
    try {
        const { name } = req.query
        const users = await User.find({username : name}).populate("books.bookid");
        res.json(users)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})






/**
 * @swagger
 * paths:
 *   /api/users/{id}:
 *     get:
 *       summary: Get a user by ID and populate their books.
 *       tags: [Users]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: ID of the user to retrieve.
 *           schema:
 *             type: string
 *         - in: header
 *           name: auth-token
 *           schema:
 *             type: string
 *           required: true
 *           description: An authentication token to access the API.
 *       security:
 *         - auth-token: []
 *       responses:
 *         '200':
 *           description: User with books retrieved successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/UserWithBooks'
 *         '500':
 *           description: Internal Server Error.
 */



router.get('/:id',fetchuser, async (req, res) => {
    try {
        
        const user = await User.findById({ _id: req.params.id }).populate('books');
     const books=[];
        // Access book details through the populated 'books' field
        const booksDetails = await Promise.all(user.books.map(async (book) => {
            const id= book.bookid
          const bookDetail = await Book.findById(id);
          console.log(book.bookid,bookDetail)
          books.push(bookDetail)
          return books
        }));
        
        // console.log(booksDetails);
        const username=user.username
        const id=user.id
        const obj={
            username,
            id
            
        }
        
        res.json({ obj, books });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})







/**
 * @swagger
 * paths:
 *   /api/users/familyname/:
 *     get:
 *       summary: Get a user by familyname.
 *       tags: [Users]
 *       parameters:
 *         - in: path
 *           name: familyname
 *           required: true
 *           description: Family name of the user .
 *           schema:
 *             type: string
 *         - in: header
 *           name: auth-token
 *           schema:
 *             type: string
 *           required: true
 *           description: An authentication token to access the API.
 *       security:
 *         - auth-token: []
 *       responses:
 *         '200':
 *           description: Users with familyname retrieved successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/UserWithBooks'
 *         '500':
 *           description: Internal Server Error.
 */




router.get('/familyname/',fetchuser, async (req, res) => {
    try {
        const { familyname } = req.query;
        const users = await User.find({familyName : familyname},);
        res.json(users)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})








/**
 * @swagger
 * paths:
 *   /api/users/add:
 *     post:
 *       summary: Add a user with authentication.
 *       tags: [Users]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                 fatherName:
 *                   type: string
 *                 familyName:
 *                   type: string
 *                 address:
 *                   type: string
 *                 phoneNumber:
 *                   type: string
 *                 email:
 *                   type: string
 *                 accountType:
 *                   type: string
 *       parameters:
 *         - in: header
 *           name: auth-token
 *           schema:
 *             type: string
 *           required: true
 *           description: An authentication token to access the API.
 *       security:
 *         - auth-token: []
 *       responses:
 *         '200':
 *           description: User added successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 *         '400':
 *           description: Bad request, validation errors.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   errors:
 *                     type: array
 *                     items:
 *                       type: object
 *         '500':
 *           description: Internal Server Error.
 */



router.post('/add',fetchuser, async (req, res) => {
    try {
        const { username, fatherName, familyName, address, phoneNumber, email,accountType} = req.body;
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const user = new User({
            username, fatherName, familyName, address, phoneNumber, email, accountType
        });

        const savedUser = await user.save();

        res.json(savedUser);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});






/**
 * @swagger
 * paths:
 *   /api/users/update/{id}:
 *     put:
 *       summary: Update a user by ID with authentication.
 *       tags: [Users]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: ID of the user to update.
 *           schema:
 *             type: string
 *         - in: header
 *           name: auth-token
 *           schema:
 *             type: string
 *           required: true
 *           description: An authentication token to access the API.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                 fatherName:
 *                   type: string
 *                 familyName:
 *                   type: string
 *                 address:
 *                   type: string
 *                 phoneNumber:
 *                   type: string
 *                 email:
 *                   type: string
 *                 accountType:
 *                   type: string
 *       security:
 *         - auth-token: []
 *       responses:
 *         '200':
 *           description: User updated successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 *         '500':
 *           description: Internal Server Error.
 */




router.put('/add/:id',fetchuser, async (req, res) => {
    const { username, fatherName, familyName, address, phoneNumber, email,accountType} = req.body;
    try {
        const newUser = {};
        //what he wants to update and what he doesn't want to update
        //if true and exists in body then only update it
        //update with new book obj with data sent acc to obj body
        if (username) { newBook.username = username };
        if (fatherName) { newBook.fatherName = fatherName };
        if (familyName) { newBook.familyName = familyName };
        if (address) { newBook.address = address };
        if (phoneNumber) { newBook.phoneNumber = phoneNumber };
        if (email) { newBook.email = email };
        if (accountType) { newBook.accountType = accountType };
        

        //img : 1 ,name :1 means field we want and _id :0 means field we donot want
        const users = await  User.updateOne({_id:req.params.id},{ $set: newBook }, { new: true });
       
        res.json(users)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})






/**
 * @swagger
 * paths:
 *   /api/users/delete/{id}:
 *     delete:
 *       summary: Delete a user by ID with authentication.
 *       tags: [Users]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: ID of the user to delete.
 *           schema:
 *             type: string
 *         - in: header
 *           name: auth-token
 *           schema:
 *             type: string
 *           required: true
 *           description: An authentication token to access the API.
 *       security:
 *         - auth-token: []
 *       responses:
 *         '200':
 *           description: User deleted successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   Success:
 *                     type: string
 *                   user:
 *                     $ref: '#/components/schemas/User'
 *         '404':
 *           description: User not found.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *         '500':
 *           description: Internal Server Error.
 */


router.delete("/delete/:id",fetchuser, async (req, res) => {
    try {
      // Find the book to be delete and delete it
      let user = await User.findOneAndDelete({ _id: req.params.id });
      
      console.log(user,user.id,req.params.id )
      if (!user) {
        return res.status(404).send("Not Found");
      }
      res.json({ Success: "user has been deleted", user: user });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  });






  /**
 * @swagger
 * paths:
 *   /api/users/deleteall:
 *     delete:
 *       summary: Delete all users.
 *       tags: [Users]
 *       parameters:
 *         - in: header
 *           name: auth-token
 *           schema:
 *             type: string
 *           required: true
 *           description: An authentication token to access the API.
 *       security:
 *         - auth-token: []
 *       responses:
 *         '200':
 *           description: ALL Users deleted successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   Success:
 *                     type: string
 *                   user:
 *                     $ref: '#/components/schemas/User'
 *         '404':
 *           description: User not found.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *         '500':
 *           description: Internal Server Error.
 */




router.put('/deleteall',fetchuser, async (req, res) => {
    try {
        //empty all users array from all users 
      
        const users = await  User.updateMany({},{ $set: { users:[]} });
       
        res.json(users)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})







/**
 * @swagger
 * paths:
 *   /api/users/addbooks:
 *     post:
 *       summary: Add books to a user's collection with authentication.
 *       tags: [Users]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userid:
 *                   type: string
 *                 bookid:
 *                   type: string
 *       parameters:
 *         - in: header
 *           name: auth-token
 *           schema:
 *             type: string
 *           required: true
 *           description: An authentication token to access the API.
 *       security:
 *         - auth-token: []
 *       responses:
 *         '200':
 *           description: Books added to user's collection successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                   user:
 *                     $ref: '#/components/schemas/User'
 *         '400':
 *           description: Bad request, validation errors.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   errors:
 *                     type: array
 *         '404':
 *           description: User not found.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *         '500':
 *           description: Internal Server Error.
 */



router.post('/addbooks',fetchuser, async (req, res) => {
    try {
        const {  userid, bookid} = req.body;
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
      
        const updatedUser = await User.findOneAndUpdate(
            { _id: userid },
            {
              $push: {
                books: {
                  bookid: bookid,
                
                }
              }
            },
            { new: true }
        );
        const orderedBook = {
            userid,
            bookid
          };
         const orderedbooks= await OrderedBooks.create(orderedBook);
      

        if (updatedUser) {
            console.log('User updated with new book:', updatedUser);
            // Respond with a success message or updated user data
            res.status(200).json({ message: 'Book added to user', user: updatedUser });
          } else {
            console.log('User not found');
            // Respond with an error message indicating the user was not found
            res.status(404).json({ message: 'User not found' });
          }
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});





/**
 * @swagger
 * paths:
 *   /api/users/books/orders:
 *     get:
 *       summary: Get all ordered books.
 *       tags: [Users]
 *       parameters:
 *         - in: header
 *           name: auth-token
 *           schema:
 *             type: string
 *           required: true
 *           description: An authentication token to access the API.
 *       security:
 *         - auth-token: []
 *       responses:
 *         '200':
 *           description: Ordered books retrieved successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/OrderedBook'
 *         '500':
 *           description: Internal Server Error.
 */




router.get('/books/orders',fetchuser, async (req, res) => {
    try {
        
        const users = await OrderedBooks.find().populate('userid').populate('bookid');
        res.json(users)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router;