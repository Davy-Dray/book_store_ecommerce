
class Book {
    constructor(id, quantity, price, title, author) {
        this.id = id;
        this.price = price;
        this.quantity = quantity;
        this.title = title;
        this.author = author;
    }
}
module.exports = Book;