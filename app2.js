const express = require('express');
const app = express();
const connectDB = require('./db/conn');
require('dotenv').config();

const Book = require('./routes/books')


const port = process.env.PORT

const url = process.env.DATABASE
//middleware

app.use(express.json());


app.use('/book',Book)

const start = async () =>{
    try {
        await connectDB(url);
        app.listen(port,console.log(`Server is listening at port: ${port}`));
    } catch (error) {
        console.log(error);
    }
}

start();
