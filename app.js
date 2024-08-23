const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const logger = require("./middlewares/logger");
const { notFound, errorHandler } = require("./middlewares/errors");
const connectToDB = require("./config/db");
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

// Connection To Database
connectToDB();

// Init App
const app = express();

// Static Folder
app.use(express.static(path.join(__dirname, "images")));

// Apply Middleware
app.use(express.json()); // JSON to JS object
app.use(express.urlencoded({ extended: false }));
app.use(logger);

// Helmet
app.use(helmet());

// Cors Policy
app.use(cors({
    origin: process.env.FRONTEND_HOST
}));

// EJS
app.set("view engine", "ejs");

// Load the YAML file
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use("/api/books", require("./routes/books"));
app.use("/api/authers", require("./routes/authors"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/upload", require("./routes/upload"));
app.use("/password", require("./routes/password"));

// Not Found Middleware
app.use(notFound);

// Error Handler Middleware
app.use(errorHandler);

// Running the server
const PORT = process.env.PORT || 5000;
const ENV = process.env.NODE_ENV;
app.listen(PORT, () =>
    console.log(`Server is running in ${ENV} mode on port ${PORT}`)
);
