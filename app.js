const express = require("express");
const booksPath = require("./routes/books");

// Init App
const app = express();

// Apply Middleware
app.use(express.json()); // JSON to JS object

//Routes
app.use("/api/books", booksPath);

// Running the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
