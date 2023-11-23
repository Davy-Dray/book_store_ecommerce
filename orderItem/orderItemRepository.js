const sql = require('mssql');


async function create(transaction, insertedOrderId, order) {
    const orderItemsQuery = `
        INSERT INTO OrderItems (order_id, book_id, quantity, price_at_order)
        VALUES (@order_id, @book_id, @quantity, @price_at_order);
    `;

    for (const item of order.items) {
        const orderItemsRequest = transaction.request();

        orderItemsRequest
            .input('order_id', sql.Int, insertedOrderId)
            .input('book_id', sql.Int, item.book_id)
            .input('quantity', sql.Int, item.quantity)
            .input('price_at_order', sql.Decimal(10, 2), item.getTotalCost());

        await orderItemsRequest.query(orderItemsQuery);

    }
}



module.exports = { create }