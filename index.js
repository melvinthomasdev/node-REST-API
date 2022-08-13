const express = require('express');
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");

dotenv.config();

mongoose.connect(
    process.env.MONGO_URL, 
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true
    }, () => {
    console.log("Connected to Database");
});

// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));


app.get("/", (request, response) => {
    response.send("Welcome to the Home page");
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
} );