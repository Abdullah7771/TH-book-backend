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
// Available Routes
// One Route for each (Player, Team, Round)
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', require('./auth/auth'))
app.use("/api/books", require("./routes/book"));
app.use("/api/users", require("./routes/user"));
app.use("/api/subjects", require("./routes/subject"));
app.use("/api/classes", require("./routes/class"));

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

// db.Class.insertMany( [
//   { class: "KGII" },
//   { class: "1" },
//   { class: "2" },
//   { class: "3" },
//   { class: "4" },
//   { class: "5" },
//   { class: "6" },
//   { class: "7" },
//   { class: "8" },
//   { class: "9" ,category:'Biology'},
//   { class: "9" ,category:'Computer Science'},
//   { class: "9" ,category:'Arts'},
//   { class: "10" ,category:'Biology'},
//   { class: "10" ,category:'Computer Science'},
//   { class: "10" ,category:'Arts'},
//   { class: "11" ,category:'Pre-Engineering'},
//   { class: "11" ,category:'Pre-Medical'},
//   { class: "11" ,category:'Arts'},
//   { class: "12" ,category:'Pre-Engineering'},
//   { class: "12" ,category:'Pre-Medical'},
//   { class: "12" ,category:'Arts'},
//   { class: "University",category:"BBA" },
//   { class: "University",category:"SE" },
//   { class: "University",category:"ENG" },
//   { class: "University",category:"MED" },
//   { class: "University",category:"Other" },
//   { class: "Other" },

// ]

//   );

// db.Class.insertMany( [
//   { subject: "Urdu" },
//   { subject: "English" },
//   { subject: "Math" },
//   { subject: "Social Studies" },
//   { subject: "Science" },
//   { subject: "Islamiat" },
//   { subject: "Chemistry" },
//   { subject: "Physics" },
//   { subject: "Biology" },
//   { subject: "Uni Books" },
//   { subject: "Other" },
// ]);

// db.Users.insertMany([
//   {
//     username: "Usama",
//     fatherName: "Saif",
//     familyName: "Khattal",
//     address: "Nazimabad No.3",
//     phoneNumber: "0332742272",
//     email: "usama@gmail.com",
//     accountType: "Admin",
//   },
//   {
//     username: "Shuraim",
//     fatherName: "Hasan",
//     familyName: "Khattal",
//     address: "Nazimabad No.1",
//     phoneNumber: "03287382872",
//     email: "shuraim@ghu.com",
//     accountType: "User",
//   },
// ]);
