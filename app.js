const express = require("express");
const mongoose = require("mongoose");
const booksPath = require("./routes/books");
const authorPath = require("./routes/authors")
const dotenv = require("dotenv");
const logger = require("./middlewares/logger");
const { notFound, errorHandler } = require("./middlewares/errors");

// Dotenv 
dotenv.config();

// Connection To Database
mongoose
    .connect(process.env.MONGO_URI) // Connection between mongodb and express
    .then(() => console.log("Connected Successfully To Mongodb...")) //Promise
    .catch(() => console.log("Connection Failed To Mongodb!", error))

// Init App
const app = express();

// Apply Middleware
app.use(express.json()); // JSON to JS object
app.use(logger);

//Routes
app.use("/api/books", booksPath);
app.use("/api/authers", authorPath);

// Not Found Middleware
app.use(notFound);

// Error Handler Middleware
app.use(errorHandler);

// Running the server
const PORT = process.env.PORT || 5000;
const ENV = process.env.NODE_ENV;
app.listen(PORT, () => console.log(`Server is running in ${ENV} mode on port ${PORT}`));
