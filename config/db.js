const mongoose = require("mongoose");

async function connectToDB() {
    console.log("Attempting to connect to MongoDB...");
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 50000
        });
        console.log("Connected Successfully To Mongodb...");
    } catch (error) {
        console.error("Connection Failed To Mongodb!", error.message);
    }
}

module.exports = connectToDB;



// mongoose
//     .connect(process.env.MONGO_URI) // Connection between mongodb and express
//     .then(() => console.log("Connected Successfully To Mongodb...")) //Promise
//     .catch(() => console.log("Connection Failed To Mongodb!", error))