var express = require('express');
const { getUsers, createUser, getUserByEmail, updateUser, getUserOrders } = require('../user/userController');
var router = express.Router();

router.get('/user', getUsers);
router.get('/user/:email', getUserByEmail);
router.get('/user/order/:userId', getUserOrders);

router.post('/user', createUser);
router.patch('/user/:email', updateUser);


module.exports = router;
