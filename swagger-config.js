const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0", // Specify the OpenAPI version
    info: {
      title: "Your API Documentation",
      version: "1.0.0",
      description: "API documentation for Nawait Book",
    },
    servers: [
      {
        url: "http://localhost:5000", // Update with your API's base URL
      },
    ],
  },

  // Path to the API routes
  apis: ["./routes/*.js", "./auth/auth.js"], // Update this path to match your actual route files
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;

/**
 * @swagger
 * path:
 *   /api/book/{id}:
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

/**
 * @swagger
 * path:
 *   /api/book/name:
 *     get:
 *       summary: Get a book by name.
 *       tags: [Books]
 *       parameters:
 *         - in: query
 *           name: name
 *           required: true
 *           description: Name of the book to retrieve.
 *           schema:
 *             type: string
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

/**
 * @swagger
 * path:
 *   /api/book/author:
 *     get:
 *       summary: Get a book by author.
 *       tags: [Books]
 *       parameters:
 *         - in: query
 *           name: author
 *           required: true
 *           description: Author of the book to retrieve.
 *           schema:
 *             type: string
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

/**
 * @swagger
 * path:
 *   /api/book/available:
 *     get:
 *       summary: Get all available books.
 *       tags: [Books]
 *       description: Returns a list of all available books.
 *       responses:
 *         '200':
 *           description: A list of available books.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Book'
 *         '404':
 *           description: No available books found.
 */

/**
 * @swagger
 * path:
 *   /api/book/add:
 *     post:
 *       summary: Add a new book.
 *       tags: [Books]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
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
 *       responses:
 *         '200':
 *           description: The newly added book.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Book'
 *         '400':
 *           description: Invalid request body.
 *         '500':
 *           description: Internal Server Error.
 */

/**
 * @swagger
 * path:
 *   /api/book/update/{id}:
 *     put:
 *       summary: Update an existing book by ID.
 *       tags: [Books]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: ID of the book to update.
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
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
 *       responses:
 *         '200':
 *           description: The updated book.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Book'
 *         '400':
 *           description: Invalid request body.
 *         '404':
 *           description: Book not found.
 *         '500':
 *           description: Internal Server Error.
 */

/**
 * @swagger
 * path:
 *   /api/book/delete/{id}:
 *     delete:
 *       summary: Delete an existing book by ID.
 *       tags: [Books]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: ID of the book to delete.
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: Success message.
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
 *         '500':
 *           description: Internal Server Error.
 */

/**
 * @swagger
 * path:
 *   /api/book/soldout/add:
 *     post:
 *       summary: Add a book to the sold-out list.
 *       tags: [Books]
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
 *           description: Success message.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *         '400':
 *           description: Invalid request body.
 *         '404':
 *           description: User not found.
 *         '500':
 *           description: Internal Server Error.
 */

/**
 * @swagger
 * path:
 *   /api/book/soldout/fetch:
 *     get:
 *       summary: Get a list of sold-out books.
 *       tags: [Books]
 *       description: Returns a list of sold-out books.
 *       responses:
 *         '200':
 *           description: A list of sold-out books.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/SoldOutBook'
 *         '500':
 *           description: Internal Server Error.
 */

/**
 * @swagger
 * path:
 *   /api/book/reqbook/send:
 *     post:
 *       summary: Send a book request.
 *       tags: [Books]
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
 *           description: Success message.
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
 *           description: Invalid request body.
 *         '404':
 *           description: User not found.
 *         '500':
 *           description: Internal Server Error.
 */

/**
 * @swagger
 * path:
 *   /api/book/reqbook/fetch:
 *     get:
 *       summary: Get a list of book requests.
 *       tags: [Books]
 *       description: Returns a list of book requests.
 *       responses:
 *         '200':
 *           description: A list of book requests.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/RequestedBook'
 *         '500':
 *           description: Internal Server Error.
 */

/**
 * @swagger
 * path:
 *   /api/book/donatebook/send:
 *     post:
 *       summary: Send a book donation request.
 *       tags: [Books]
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
 *           description: Success message.
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
 *           description: Invalid request body.
 *         '404':
 *           description: User not found.
 *         '500':
 *           description: Internal Server Error.
 */

/**
 * @swagger
 * path:
 *   /api/book/donatebook/fetch:
 *     get:
 *       summary: Get a list of book donation requests.
 *       tags: [Books]
 *       description: Returns a list of book donation requests.
 *       responses:
 *         '200':
 *           description: A list of book donation requests.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/DonateBook'
 *         '500':
 *           description: Internal Server Error.
 */

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
