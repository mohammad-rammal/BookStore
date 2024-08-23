
const connectToDB = require("./config/db");
const books = require("./data");
const { Book } = require("./models/Book");
const dotenv = require("dotenv").config();

// Connection To DB
connectToDB();

// Import Books To DB
const importBooks = async () => {
    try {
        await Book.insertMany(books);
        console.log("Books Imported")
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

// Remove Books From DB
const removeBooks = async () => {
    try {
        await Book.deleteMany();
        console.log("Books Removed")
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

if (process.argv[2] === "-import") {
    importBooks();
} else if (process.argv[2] === "-remove") {
    removeBooks();
}