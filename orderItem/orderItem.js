class OrderItem {
    constructor(book_id, quantity, price_at_order) {
        this.book_id = book_id;
        this.quantity = quantity;
        this.price_at_order = price_at_order;
    }
    getTotalCost() {
        return this.quantity * this.price_at_order;
    }
}

module.exports = OrderItem;