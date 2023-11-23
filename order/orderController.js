const orderRepository = require('./orderRepository');
const Order = require('./order');
const OrderItem = require('../orderItem/orderItem');

async function orderBook(req, res) {
    try {
        const { user_id, status, items } = req.body;
        const order = new Order(user_id, status, items.map(item =>
            new OrderItem(item.book_id, item.quantity, item.price_at_order)
        ));

        await orderRepository.saveOrder(order);

        res.status(201).json({
            message: 'Order created successfully',
            order: {
                user_id: order.user_id,
                status: order.status,
                total_cost: order.getTotalCost(),
                items: order.items.map(item => ({
                    book_id: item.book_id,
                    quantity: item.quantity,
                    price_at_order: item.price_at_order,
                    total_cost: item.getTotalCost()
                }))
            }
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = { orderBook };
