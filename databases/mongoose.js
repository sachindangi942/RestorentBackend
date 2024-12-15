const mongoose = require("mongoose");
require("colors");
const url = process.env.MONGODB_URL
const dbName = process.env.DATABASE_NAME 
const db_connection =async()=>{

    try {
       await mongoose.connect(`${url}/${dbName}`)
        console.log(`connection successfull`.rainbow);

    } catch (error) {
        console.log(`connection failed`.red)
    }

};

module.exports = {db_connection}