const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const SoldOutBooks = require("../models/SoldOutBooks");
const RequestedBooks = require("../models/RequestedBooks");
const DonateBooks = require("../models/DonateBooks");

const fetchuser = require("../middleware/fetchuser");

const multer = require("multer");
const { body, validationResult } = require("express-validator");

var mongodb = require("mongodb");
const User = require("../models/User");

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Book-related endpoints
 */

/**
 * @swagger
 * paths:
 *   /api/books/fetchall:
 *     get:
 *       summary: Get all books.
 *       tags:
 *         - Books
 *       description: Returns a list of all books.
 *       security:
 *         - auth-token: []
 *       responses:
 *         '200':
 *           description: A list of books.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Book'
 *       parameters:
 *         - in: header
 *           name: auth-token
 *           schema:
 *             type: string
 *           required: true
 *           description: An authentication token to access the API.
 */

router.get("/fetchall", fetchuser, async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

/**
 * @swagger
 * paths:
 *   /api/books/pagination:
 *     get:
 *       summary: Get all books with pagination.
 *       tags:
 *         - Books
 *       description: Returns a list of books with pagination support.
 *       security:
 *         - auth-token: []
 *       parameters:
 *         - in: header
 *           name: auth-token
 *           schema:
 *             type: string
 *           required: true
 *           description: An authentication token to access the API.
 *         - in: query
 *           name: page
 *           schema:
 *             type: integer
 *           required: false
 *           description: The page number for pagination. Default is 1.
 *       responses:
 *         '200':
 *           description: A list of books.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Book'
 */

const ITEMS_PER_PAGE = 10;

router.get("/pagination", fetchuser, async (req, res) => {
  try {
    // Get the page number from the query parameters, defaulting to 1 if not provided
    const page = parseInt(req.query.page) || 1;

    // Calculate the skip value based on the page number
    const skip = (page - 1) * ITEMS_PER_PAGE;

    // Fetch the books with pagination
    const books = await Book.find().skip(skip).limit(ITEMS_PER_PAGE);

    res.json(books);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

/**
 * @swagger
 * paths:
 *   /api/books/class/:
 *     get:
 *       summary: Get books by grade/class.
 *       tags: [Books]
 *       parameters:
 *         - in: query
 *           name: grade
 *           required: true
 *           description: Class of the book to retrieve.
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
 *           description: A book object.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Book'
 *         '404':
 *           description: Book not found.
 */

router.get("/class/", async (req, res) => {
  try {
    const { grade } = req.query;
    const books = await Book.find({ grade: grade });
    res.json(books);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

/**
 * @swagger
 * paths:
 *   /api/books/queryall/:
 *     get:
 *       summary: Get books by grade/class.
 *       tags: [Books]
 *       parameters:
 *         - in: query
 *           name: grade
 *           required: false
 *           description: Class of the book to retrieve.
 *           schema:
 *             type: string
 *         - in: query
 *           name: subject
 *           required: false
 *           description: Subject of the book to retrieve.
 *           schema:
 *             type: string
 *         - in: query
 *           name: name
 *           required: false
 *           description: Title of the book to retrieve(Search input).
 *           schema:
 *             type: string
 *         - in: query
 *           name: status
 *           required: false
 *           description: Status of the book to retrieve.
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
 *           description: A book object.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Book'
 *         '404':
 *           description: Book not found.
 */

router.get("/queryall/", async (req, res) => {
  try {
    const { grade, subject, status, name } = req.query;

    // Construct the query object based on the provided parameters
    const query = {};
    if (grade) query.grade = grade;
    if (subject) query.subject = subject;
    if (name) {
      // Use a regular expression for partial matching of the name
      query.name = { $regex: new RegExp(name, "i") }; // 'i' for case-insensitive matching
    }
    if (status) query.status = status;
    else query.status = "available"; // Default value if status is not provided

    // Fetch books based on the constructed query
    const books = await Book.find(query);

    res.json(books);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

/**
 * @swagger
 * paths:
 *   /api/books/subject/:
 *     get:
 *       summary: Get books by subject.
 *       tags: [Books]
 *       parameters:
 *         - in: query
 *           name: name
 *           required: true
 *           description: Subject of the book to retrieve.
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
 *           description: A book object.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Book'
 *         '404':
 *           description: Book not found.
 */

router.get("/subject/", async (req, res) => {
  try {
    const { name } = req.query;
    const books = await Book.find({ subject: name });
    res.json(books);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 2: Get All the books using id as params using: GET "/api/book/:id"

/**
 * @swagger
 * paths:
 *   /api/books/{id}:
 *     get:
 *       summary: Get a book by ID.
 *       tags: [Books]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: ID of the book to retrieve.
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
 *           description: A book object.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Book'
 *         '404':
 *           description: Book not found.
 */
router.get("/:id", fetchuser, async (req, res) => {
  // const { playerid } = req.params.id;

  try {
    //find that book whose id is equal to id sent in params
    let book = await Book.findOne({ id: req.params.id });
    if (!book) {
      return res.status(404).send("Not Found");
    }
    res.json(book);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

/**
 * @swagger
 * paths:
 *   /api/books/fetch/bookname/:
 *     get:
 *       summary: Get a book by name.
 *       tags: [Books]
 *       parameters:
 *         - in: header
 *           name: auth-token
 *           schema:
 *             type: string
 *           required: true
 *           description: An authentication token to access the API.
 *         - in: query
 *           name: name
 *           required: true
 *           description: Name of the book to retrieve.
 *           schema:
 *             type: string
 *       security:
 *         - auth-token: []

 *       responses:
 *         '200':
 *           description: A book object.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Book'
 *         '404':
 *           description: Book not found.
 */

router.get("/fetch/bookname", fetchuser, async (req, res) => {
  // const { playerid } = req.params.id;
  try {
    const { name } = req.query;
    //find that book whose id is equal to id sent in params
    let book = await Book.find({ name: name });
    console.log("jads");
    if (!book) {
      return res.status(404).send("Not Found");
    }

    res.json(book);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

/**
 * @swagger
 * paths:
 *   /api/books/fetch/author/:
 *     get:
 *       summary: Get a book by author name.
 *       tags: [Books]
 *       parameters:
 *         - in: header
 *           name: auth-token
 *           schema:
 *             type: string
 *           required: true
 *           description: An authentication token to access the API.
 *         - in: query
 *           name: name
 *           required: true
 *           description: Author of the book to retrieve.
 *           schema:
 *             type: string
 *       security:
 *         - auth-token: []
 *       responses:
 *         '200':
 *           description: A book object.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Book'
 *         '404':
 *           description: Book not found.
 */

router.get("/fetch/author", fetchuser, async (req, res) => {
  // const { playerid } = req.params.id;
  const { name } = req.query;
  try {
    //find that book whose id is equal to id sent in params
    let book = await Book.find({ author: name });
    if (!book) {
      return res.status(404).send("Not Found");
    }
    res.json(book);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

/**
 * @swagger
 * paths:
 *   /api/books/available/fetch:
 *     get:
 *       summary: Get all books available.
 *       tags:
 *         - Books
 *       description: Returns a list of all books that are available.
 *       security:
 *         - auth-token: []
 *       responses:
 *         '200':
 *           description: A list of books.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Book'
 *                 items:
 *                   $ref: '#/components/schemas/Book'
 *       parameters:
 *         - in: header
 *           name: auth-token
 *           schema:
 *             type: string
 *           required: true
 *           description: An authentication token to access the API.
 */

router.get("/available/fetch", fetchuser, async (req, res) => {
  try {
    //find that book whose id is equal to id sent in params
    let book = await Book.find({ status: "available" });
    if (!book) {
      return res.status(404).send("Not Found");
    }
    res.json(book);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 3: Get All the books sort by category using params by : GET "/api/book/type/:category"
// router.get('/type/:category', async (req, res) => {
//     try {

//         //find that book whose type is equal to category sent in params e.g bowler,batsman etc
//         let book = await Book.find({ type: req.params.category });
//         if (!book) { return res.status(404).send("Not Found") }
//         res.json( book );
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).send("Internal Server Error");
//     }
// })

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images"); // Choose your destination directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// ROUTE 5: Add a new Book using: POST "/api/book/add"

/**
 * @swagger
 * paths:
 *   /api/books/add:
 *     post:
 *       summary: Add a book with an image upload.
 *       tags: [Books]
 *       parameters:
 *         - in: header
 *           name: auth-token
 *           schema:
 *             type: string
 *           required: true
 *           description: An authentication token to access the API.
 *       security:
 *         - auth-token: []
 *       requestBody:
 *         required: true
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 subject:
 *                   type: string
 *                 status:
 *                   type: string
 *                 grade:
 *                   type: string
 *                 count:
 *                   type: integer
 *                 author:
 *                   type: string
 *                 img:
 *                   type: string
 *       responses:
 *         '200':
 *           description: Book added successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Book'
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

router.post("/add", fetchuser, upload.single("img"), async (req, res) => {
  try {
    const { name, subject, status, grade, count, author } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const imgFilename = req.file.originalname;
    const img = `https://th-backend-kd10.onrender.com/images/${imgFilename}`;
    // const img = {
    //   data: req.file.buffer,
    //   contentType: req.file.mimetype,
    // };

    console.log(img);
    const book = new Book({
      name,
      subject,
      status,
      grade,
      count,
      author,
      img,
    });

    const savedBook = await book.save();

    res.json(savedBook);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 6: Update an existing Book using: PUT "/api/book/update"

/**
 * @swagger
 * paths:
 *   /api/books/update/{id}:
 *     put:
 *       summary: Update a book by ID with an image upload.
 *       tags: [Books]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: ID of the book to update.
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
 *       requestBody:
 *         required: true
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 subject:
 *                   type: string
 *                 status:
 *                   type: string
 *                 grade:
 *                   type: string
 *                 count:
 *                   type: integer
 *                 author:
 *                   type: string
 *                 img:
 *                   type: string
 *       responses:
 *         '200':
 *           description: Book updated successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Book'
 *         '404':
 *           description: Book not found.
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

router.put("/update/:id", fetchuser, upload.single("img"), async (req, res) => {
  //Post in obj body
  const { name, subject, status, grade, count, author } = req.body;
  try {
    // Create a newBook object
    const newBook = {};
    //what he wants to update and what he doesn't want to update
    //if true and exists in body then only update it
    //update with new book obj with data sent acc to obj body
    if (status) {
      newBook.status = status;
    }
    if (name) {
      newBook.name = name;
    }
    if (subject) {
      newBook.subject = subject;
    }
    if (count) {
      newBook.count = count;
    }
    if (author) {
      newBook.author = author;
    }
    if (grade) {
      newBook.grade = grade;
    }
    const newImg = {
      data: req.file.buffer,
      contentType: req.file.mimetype,
    };
    if (newImg) {
      newBook.img = newImg;
    }

    // Find the book to be updated through params and update it according to new book obj
    let book = await Book.findOneAndUpdate(
      { _id: req.params.id },
      { $set: newBook },
      { new: true }
    );
    if (!book) {
      return res.status(404).send("Not Found");
    }
    res.json(book);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// // ROUTE 7: Delete an existing Book using id  using: DELETE "/api/book/delete/:id". Login required

/**
 * @swagger
 * paths:
 *   /api/books/delete/{id}:
 *     delete:
 *       summary: Delete a book by ID.
 *       tags: [Books]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: ID of the book to delete.
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
 *           description: Book deleted successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   Success:
 *                     type: string
 *                   book:
 *                     $ref: '#/components/schemas/Book'
 *         '404':
 *           description: Book not found.
 */

router.delete("/delete/:id", fetchuser, async (req, res) => {
  try {
    // Find the book to be delete and delete it
    let book = await Book.findOneAndDelete({ _id: req.params.id });
    if (!book) {
      return res.status(404).send("Not Found");
    }
    res.json({ Success: "Book has been deleted", book: book });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

/**
 * @swagger
 * paths:
 *   /api/books/soldout/add:
 *     post:
 *       summary: Add a book to the sold-out list.
 *       tags: [SoldOutBooks]
 *       parameters:
 *         - in: header
 *           name: auth-token
 *           schema:
 *             type: string
 *           required: true
 *           description: An authentication token to access the API.
 *       security:
 *         - auth-token: []
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
 *       responses:
 *         '200':
 *           description: Book added to the sold-out list successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
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

router.post("/soldout/add", fetchuser, async (req, res) => {
  try {
    const { userid, bookid } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = User.find({ id: userid });

    const soldoutBook = {
      userid,
      bookid,
    };
    const soldoutbooks = await SoldOutBooks.create(soldoutBook);

    if (user) {
      console.log("Req sent for soldoutbook");
      // Respond with a success message or updated user data
      res.status(200).json({ message: "Req sent for soldoutbook" });
    } else {
      console.log("User not found");
      // Respond with an error message indicating the user was not found
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

/**
 * @swagger
 * paths:
 *   /api/books/soldout/fetch:
 *     get:
 *       summary: Get all soldout books.
 *       tags:
 *         - SoldOutBooks
 *       description: Returns a list of all soldout books.
 *       security:
 *         - auth-token: []
 *       responses:
 *         '200':
 *           description: A list of books.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Book'
 *       parameters:
 *         - in: header
 *           name: auth-token
 *           schema:
 *             type: string
 *           required: true
 *           description: An authentication token to access the API.
 */

router.get("/soldout/fetch", fetchuser, async (req, res) => {
  try {
    const soldoutbooks = await SoldOutBooks.find()
      .populate("userid")
      .populate("bookid");

    res.json(soldoutbooks);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

/**
 * @swagger
 * paths:
 *   /api/books/reqbook/send:
 *     post:
 *       summary: Send a book request.
 *       tags: [RequestBooks]
 *       parameters:
 *         - in: header
 *           name: auth-token
 *           schema:
 *             type: string
 *           required: true
 *           description: An authentication token to access the API.
 *       security:
 *         - auth-token: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userid:
 *                   type: string
 *                 bookname:
 *                   type: string
 *                 grade:
 *                   type: string
 *                 subject:
 *                   type: string
 *       responses:
 *         '200':
 *           description: Book request sent successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                   bookname:
 *                     type: string
 *                   grade:
 *                     type: string
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

router.post("/reqbook/send", fetchuser, async (req, res) => {
  try {
    const { userid, bookname, grade, subject } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = User.find({ id: userid });

    const reqBook = {
      userid,
      bookname,
      grade,
      subject,
    };
    const reqBooks = await RequestedBooks.create(reqBook);

    if (user) {
      console.log("Req sent for a book");
      // Respond with a success message or updated user data
      res.status(200).json({
        message: "Req sent for soldoutbook",
        bookname: bookname,
        grade: grade,
      });
    } else {
      console.log("User not found");
      // Respond with an error message indicating the user was not found
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

/**
 * @swagger
 * paths:
 *   /api/books/reqbook/fetch:
 *     get:
 *       summary: Get all requested books.
 *       tags:
 *         - RequestBooks
 *       description: Returns a list of all  requested books.
 *       security:
 *         - auth-token: []
 *       responses:
 *         '200':
 *           description: A list of books.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Book'
 *       parameters:
 *         - in: header
 *           name: auth-token
 *           schema:
 *             type: string
 *           required: true
 *           description: An authentication token to access the API.
 */

router.get("/reqbook/fetch", fetchuser, async (req, res) => {
  try {
    const reqBook = await RequestedBooks.find().populate("userid");

    res.json(reqBook);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

/**
 * @swagger
 * paths:
 *   /api/books/donatebook/send:
 *     post:
 *       summary: Donate  a book to us.
 *       tags: [DonateBooks]
 *       parameters:
 *         - in: header
 *           name: auth-token
 *           schema:
 *             type: string
 *           required: true
 *           description: An authentication token to access the API.
 *       security:
 *         - auth-token: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userid:
 *                   type: string
 *                 bookname:
 *                   type: string
 *                 grade:
 *                   type: string
 *                 subject:
 *                   type: string
 *       responses:
 *         '200':
 *           description: Book request sent successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                   bookname:
 *                     type: string
 *                   grade:
 *                     type: string
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

router.post("/donatebook/send", fetchuser, async (req, res) => {
  try {
    const { userid, bookname, grade, subject } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = User.find({ id: userid });

    const reqBook = {
      userid,
      bookname,
      grade,
      subject,
    };
    const reqBooks = await DonateBooks.create(reqBook);

    if (user) {
      console.log("Req sent for a book");
      // Respond with a success message or updated user data
      res.status(200).json({
        message: "Req sent for soldoutbook",
        bookname: bookname,
        grade: grade,
      });
    } else {
      console.log("User not found");
      // Respond with an error message indicating the user was not found
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

/**
 * @swagger
 * paths:
 *   /api/books/donatebook/fetch:
 *     get:
 *       summary: Get all donated books.
 *       tags:
 *         - DonateBooks
 *       description: Returns a list of all donated books.
 *       security:
 *         - auth-token: []
 *       responses:
 *         '200':
 *           description: A list of books.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Book'
 *       parameters:
 *         - in: header
 *           name: auth-token
 *           schema:
 *             type: string
 *           required: true
 *           description: An authentication token to access the API.
 */

router.get("/donatebook/fetch", fetchuser, async (req, res) => {
  try {
    const reqBook = await DonateBooks.find().populate("userid");

    res.json(reqBook);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         subject:
 *           type: string
 *         status:
 *           type: string
 *         grade:
 *           type: string
 *         count:
 *           type: integer
 *         author:
 *           type: string
 *     SoldOutBook:
 *       type: object
 *       properties:
 *         userid:
 *           type: string
 *         bookid:
 *           type: string
 *     RequestedBook:
 *       type: object
 *       properties:
 *         userid:
 *           type: string
 *         bookname:
 *           type: string
 *         grade:
 *           type: string
 *         subject:
 *           type: string
 *     DonateBook:
 *       type: object
 *       properties:
 *         userid:
 *           type: string
 *         bookname:
 *           type: string
 *         grade:
 *           type: string
 *         subject:
 *           type: string
 */

module.exports = router;
