const express = require('express');
const router = express.Router();
const Book = require('../models/bookModel')

router.route('/').get(async (req,res) =>{
    try {
        
        const allBooks = await Book.find({});
        res.status(200).json({
            count:allBooks.length,
            data:allBooks
        });
    } catch (error) {
        res.status(500).send({message:error.message});
    }
})
.post(async (req,res)=>{
    try {
        const {title,author,publishYear} = req.body;
        if(!title || !author || !publishYear)
        {
            return res.status(400).send({message:`Fill all the data first`});
        }

        const newBook = await Book.create({
            title:title,
            author:author,
            publishYear:publishYear
        });

        return res.status(200).send(newBook);
    } catch (error) {
        res.status(500).send({error:error.message});
    }
})


router.route('/:id').get( async (req,res) =>{
    try {
        const {id} = req.params;
        const isBookPresent = await Book.find({_id:id});
        if(!isBookPresent)
        {
            res.status(400).json({
                message:"Book not found"
            });
        }
        res.status(200).json({
            count:isBookPresent.length,
            data:isBookPresent
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({error:error.message});
    }
})
.put( async (req,res) =>{
    try {
        const {id} = req.params;
        const {title,author,publishYear} = req.body;
        if(!title || !author || !publishYear)
        {
            return res.status(400).send({message:`Fill all the data first`});
        }
        const updateBook = await Book.findOneAndUpdate({ _id: id },{
            title:title,
            author:author,
            publishYear:publishYear
        })  
        
        if(!updateBook)
        {
            console.log(updateBook);
            res.status(400).json({
                message:"Book not update Updated"
            });
        }
        else
        {
            res.status(200).json({
                count:updateBook.length,
                data:updateBook
            });
        }

        
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message:error.message
        })
    }
})
.delete(async (req,res) =>{
    
    try {
        const {id} = req.params;
        
        const isDeleted = await Book.findByIdAndDelete({_id:id});
        
        if(!isDeleted)
        {
            res.status(400).json({message:"Unable to delete"});
        }
        res.status(200).json({message:"Delete Succefully"});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error:error.message});
    }
})

module.exports = router;

