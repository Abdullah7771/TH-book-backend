const express = require('express');
const User = require('../models/User');
// Subdirectory/file.js
require('dotenv').config({ path: '../.env' });

const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = process.env.JWT_SECRET;

// ROUTE 1: Create a User using: POST "/api/auth/createuser". No login required


// router.post('/add', async (req, res) => {
//     try {
//         const { username, fatherName, familyName, address, phoneNumber, email,accountType} = req.body;
        
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }

//         const user = new User({
//             username, fatherName, familyName, address, phoneNumber, email, accountType
//         });

//         const savedUser = await user.save();

//         res.json(savedUser);
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).send("Internal Server Error");
//     }
// });





/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Authentication-related endpoints
 */






/**
 * @swagger
 * /createuser:
 *   post:
 *     summary: Create a new user
 *     description: Register a new user with the provided information.
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: body
 *         name: user
 *         description: User registration details
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *               minLength: 3
 *             fatherName:
 *               type: string
 *               minLength: 3
 *             familyName:
 *               type: string
 *               minLength: 3
 *             address:
 *               type: string
 *               minLength: 10
 *             phoneNumber:
 *               type: string
 *               format: mobile-phone
 *             email:
 *               type: string
 *               format: email
 *             password:
 *               type: string
 *               minLength: 5
 *             accountType:
 *               type: string
 *               enum:
 *                 - Admin
 *                 - User
 *     responses:
 *       200:
 *         description: User registered successfully
 *         schema:
 *           type: object
 *           properties:
 *             authtoken:
 *               type: string
 *       400:
 *         description: Bad request or validation error
 *         schema:
 *           type: object
 *           properties:
 *             errors:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   param:
 *                     type: string
 *                   msg:
 *                     type: string
 *       500:
 *         description: Internal Server Error
 */


router.post('/createuser', [
  body('username', 'Enter a valid name').isLength({ min: 3 }),
  body('fatherName', 'Enter a valid name').isLength({ min: 3 }),
  body('familyName', 'Enter a valid name').isLength({ min: 3 }),
  body('address', 'Enter a valid address').isLength({ min: 10 }),
  body('phoneNumber', 'Enter a valid phone number').isMobilePhone(),
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
  body('accountType').isIn(['Admin', 'User']).withMessage('Invalid account type'),
], async (req, res) => {
  // If there are errors, return Bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    // Check whether the user with this email exists already
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ error: "Sorry a user with this email already exists" })
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);
    const { username, fatherName, familyName, address, phoneNumber, email,accountType} = req.body;
    // Create a new user
    user = await User.create({
        username, fatherName, familyName, address, phoneNumber, email, accountType, password: secPass,
        book:null
    });
    const data = {
      user: {
        id: user.id
      }
    }
    console.log(data)
    const authtoken = jwt.sign(data, JWT_SECRET);


    // res.json(user)
    res.json({ authtoken })

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})












/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     tags:
 *       - Authentication
 *     description: Authenticate a user by email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 description: User's password
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the login was successful
 *                 authtoken:
 *                   type: string
 *                   description: JSON Web Token (JWT) for authentication
 *       400:
 *         description: Bad request due to validation errors or incorrect credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   description: An array of validation errors (if any)
 *                 error:
 *                   type: string
 *                   description: Error message (if login fails)
 *       500:
 *         description: Internal Server Error
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               description: Error message in case of a server error
 */


// ROUTE 2: Authenticate a User using: POST "/api/auth/login". No login required
router.post('/login', [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
  let success = false;
  // If there are errors, return Bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      success = false
      return res.status(400).json({ error: "Please try to login with correct credentials" });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      success = false
      return res.status(400).json({ success, error: "Please try to login with correct credentials" });
    }

    const data = {
      user: {
        id: user.id
      }
    }
    console.log(data);
    const authtoken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({ success, authtoken })

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }


});








/**
 * @swagger
 * /getuser:
 *   post:
 *     summary: Get user information
 *     description: Retrieve user information based on the authenticated user's token.
 *     tags:
 *       - Authentication
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successful user information retrieval
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique identifier of the user
 *                 username:
 *                   type: string
 *                   description: The username of the user
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: The email address of the user
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               description: Error message in case of a server error
 */

// ROUTE 3: Get loggedin User Details using: POST "/api/auth/getuser". Login required
router.post('/getuser', fetchuser,  async (req, res) => {

  try {
    const  userId = req.user.id;
    console.log(userId)
    const user = await User.findById(userId).select("-password")
    res.send(user)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})


module.exports = router