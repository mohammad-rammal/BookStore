const mongoose = require("mongoose");

function connectToDB() {
    try {
        mongoose
            .connect(process.env.MONGO_URI) // Connection between mongodb and express
        console.log("Connected Successfully To Mongodb...") //Promise
    } catch (error) {
        console.log("Connection Failed To Mongodb!", error)
    }
}

module.exports = connectToDB



// mongoose
//     .connect(process.env.MONGO_URI) // Connection between mongodb and express
//     .then(() => console.log("Connected Successfully To Mongodb...")) //Promise
//     .catch(() => console.log("Connection Failed To Mongodb!", error))