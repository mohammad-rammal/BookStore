const express = require("express");
const mongoose = require("mongoose");
const booksPath = require("./routes/books");
const authorPath = require("./routes/authors")

// Connection To Database
mongoose
    .connect("mongodb://localhost/bookStoreDB") // Connection between mongodb and express
    .then(() => console.log("Connected Successfully To Mongodb...")) //Promise
    .catch(() => console.log("Connection Failed To Mongodb!", error))

// Init App
const app = express();

// Apply Middleware
app.use(express.json()); // JSON to JS object

//Routes
app.use("/api/books", booksPath);
app.use("/api/authers", authorPath);

// Running the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
