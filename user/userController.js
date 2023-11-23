const userRepository = require('./userRepository');
const User = require('./user');
const orderRepository = require('../order/orderRepository');


const getUsers = async (req, res) => {
    const users = await userRepository.findAllUsers();
    res.status(200).json(users);
}

const getUserByEmail = async (req, res) => {
    const user = await userRepository.findByEmail(req.params.email);
    res.status(200).json(user);
}

const createUser = async (req, res) => {
    const { email, password } = req.body;
    const newUser = new User(email, password);
    await userRepository.save(newUser);

    res.status(201).json({
        message: 'User created successfully',
        user: newUser,
    })
};

const getUserOrders = async (req, res) => {

    const id = req.params.userId;
    const userOrders = await orderRepository.getOrdersByUser(id);

    res.status(200).json(userOrders)
}

async function updateUser(req, res) {
    const user = await userRepository.findByEmail(req.params.email);

    if (!user) {
        res.status(401).json({
            message: "error"
        })
    }
    const userEmail = req.params.email;
    const { email, password } = req.body;
    const updatedUser = {
        email: userEmail,
        updatedEmail: email,
        updatedPassword: password,
    };

    const result = await userRepository.updateUser(updatedUser);

    if (result) {
        res.status(200).json({ message: 'User updated successfully' });
    } else {
        res.status(400).json({ error: 'No fields to update or user not found' });
    }

}





module.exports = {
    getUsers,
    getUserByEmail,
    createUser,
    updateUser,
    getUserOrders
}