const express = require('express');
const { orderBook } = require('../order/orderController');
const router = express.Router();

router.post('/order', orderBook);


module.exports = router;