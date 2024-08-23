const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const logger = require("./middlewares/logger");
const { notFound, errorHandler } = require("./middlewares/errors");
const connectToDB = require("./config/db");

// Connection To Database
connectToDB();

// Init App
const app = express();

// Apply Middleware
app.use(express.json()); // JSON to JS object
app.use(logger);

//Routes
app.use("/api/books", require("./routes/books"));
app.use("/api/authers", require("./routes/authors"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));

// Not Found Middleware
app.use(notFound);

// Error Handler Middleware
app.use(errorHandler);

// Running the server
const PORT = process.env.PORT || 5000;
const ENV = process.env.NODE_ENV;
app.listen(PORT, () => console.log(`Server is running in ${ENV} mode on port ${PORT}`));
