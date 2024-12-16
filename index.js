const express = require("express");
const cors = require("cors");
const App = express();
require("dotenv").config();
const registration = require("./routes/routers")
const {db_connection} = require("./databases/mongoose")

const port = process.env.PORT || 9000
App.use(express.json());
App.use(cors({
    origin:"http://sachindangi.s3-website.eu-north-1.amazonaws.com",
    methods: ['GET', 'POST'],
}))

App.use("/user",registration);
db_connection();
App.listen(port,()=>{console.log(`server is running on port ${port}`)})


