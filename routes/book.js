const express = require('express');
const { createBook, findBookById, find, update } = require('../book/bookController');
const router = express.Router();


router.post('/book', createBook);
router.get('/book/:id', findBookById);
router.get('/book', find);
router.patch('/book/:id', update);


module.exports = router;