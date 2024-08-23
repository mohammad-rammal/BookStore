
const connectToDB = require("./config/db");
const { books, authors } = require("./data");
const { Author } = require("./models/Author");
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

// Import Authors To DB
const importAuthors = async () => {
    try {
        await Author.insertMany(authors);
        console.log("Authors Imported")
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

// Remove Authors From DB
const removeAuthors = async () => {
    try {
        await Author.deleteMany();
        console.log("Authors Removed")
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

if (process.argv[2] === "-importBooks") {
    importBooks();
} else if (process.argv[2] === "-removeBooks") {
    removeBooks();
} else if (process.argv[2] === "-importAuthors") {
    importAuthors();
} else if (process.argv[2] === "-removeAuthors") {
    removeAuthors();
}
