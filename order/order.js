class Order {
    constructor(user_id, status, items) {
        //  this.id = id;
        this.user_id = user_id;
        // this.order_date = order_date;
        this.status = status;
        // this.total_amount = total_amount;
        this.items = items || [];
    }
    getTotalCost() {
        return this.items.reduce((total, item) => total + item.getTotalCost(), 0);
    }
}


module.exports = Order;