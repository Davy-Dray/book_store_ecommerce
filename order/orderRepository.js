const sql = require('mssql');
const connectionPool = require('../config/dbconfig');
const orderItemRepository = require('../orderItem/orderItemRepository');
const bookRepository = require('../book/bookRepository');

async function saveOrder(order) {
    let transaction;
    try {
        transaction = new sql.Transaction(await connectionPool);
        await transaction.begin();

        const orderQuery = `
            INSERT INTO Orders (user_id, order_date, status, total_amount)
            OUTPUT Inserted.id
            VALUES (@user_id, @order_date, @status, @total_amount);
        `;

        for (const item of order.items) {
            const book = await bookRepository.findBookById(item.book_id);
            if (book.quantity < item.quantity) {
                throw new Error(`Not enough stock for book with ID ${item.book_id}`);
            } else {
                await bookRepository.updateBook(item.book_id, { quantity: book.quantity - item.quantity });
            }
        }
        const orderRequest = await transaction.request()
            .input('user_id', sql.Int, order.user_id)
            .input('order_date', sql.DateTime, new Date())
            .input('status', sql.nVarChar(50), order.status)
            .input('total_amount', sql.Decimal(10, 2), order.getTotalCost())
            .query(orderQuery)

        const insertedOrderId = orderRequest.recordset[0].id;

        await orderItemRepository.create(transaction, insertedOrderId, order);
        await transaction.commit();

    } catch (error) {
        await transaction.rollback();

        console.error('Error saving order in the database:', error);
        throw error;
    } finally {
        sql.close();
    }
}
async function getOrdersByUser(userId) {
    try {
        const query = `
        SELECT
        Orders.id AS order_id,
        Orders.order_date,
        Orders.status,
        Orders.total_amount,
        OrderItems.quantity,
        OrderItems.price_at_order,
        Books.title
    FROM
        Orders
    JOIN
        OrderItems ON Orders.id = OrderItems.order_id
    JOIN
        Books ON OrderItems.book_id = Books.id
    WHERE
        Orders.user_id = @user_id
    ORDER BY
        Orders.id;
        `;
        const pool = await connectionPool;
        const request = await pool.request()
            .input('user_id', sql.Int, userId)
            .query(query);

        const groupedOrders = {};
        request.recordset.forEach((row) => {
            const orderId = row.order_id;
            if (!groupedOrders[orderId]) {
                groupedOrders[orderId] = {
                    order_id: orderId,
                    order_date: row.order_date,
                    status: row.status,
                    total_amount: row.total_amount,
                    items: [],
                };
            }
            groupedOrders[orderId].items.push({
                name: row.title,
                quantity: row.quantity,
                price_at_order: row.price_at_order,
            });
        });

        return Object.values(groupedOrders);
    } catch (error) {
        console.error('Error retrieving orders by user:', error);
        throw error;
    } finally {
        sql.close();
    }
}
module.exports = { saveOrder, getOrdersByUser }