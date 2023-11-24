class Inventory {
    constructor(book_id, quantityInStock, reorderPoint) {
        this.book_id = book_id;
        this.quantityInStock = quantityInStock;
        this.reorderPoint = reorderPoint;
    }

    isBelowReorderPoint() {
        return this.quantityInStock < this.reorderPoint;
    }

    updateQuantityInStock(newQuantity) {
        this.quantityInStock = newQuantity;
    }
}

module.exports = Inventory;
