require("dotenv").config();
const connectToMongo = require("./db");
const express = require("express");
const cors = require("cors");
const path = require("path");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger-config');

connectToMongo();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', require('./auth/auth'))
app.use("/api/books", require("./routes/book"));
app.use("/api/users", require("./routes/user"));
app.use("/api/subjects", require("./routes/subject"));
app.use("/api/classes", require("./routes/class"));

app.get('/', (req, res) => {
  res.send('Backend application of Talent Hunters Book Portal,\nGo to /api-docs for accessing all routes');
});


// Serve static assets if in production
// if (process.env.NODE_ENV === "production") {
//   // Set static folder
//   app.use(express.static("frontend/build"));

//   // Catch all routes and return index.html
//   app.get("/*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
//   });
// }

//done
app.get("/api/*", (req, res) => {
  res.status(404).send({ message: "API endpoint not found" });
});

app.listen(port, () => {
  console.log(`Nawait Book backend listening at ${port}`);
});

