const bookRepository = require('./bookRepository');

async function createBook(req, res) {
    try {
        const { quantity, price, title, author } = req.body;

        const book = {
            quantity,
            price,
            title,
            author,
        };

        const result = await bookRepository.saveBook(book);

        if (result) {
            res.status(201).json({ message: 'Book created successfully' });
        } else {
            res.status(400).json({ error: 'Failed to create book' });
        }
    } catch (error) {
        console.error('Error creating book:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function findBookById(req, res) {
    try {
        const bookId = req.params.id;
        const book = await bookRepository.findBookById(bookId);
        if (book) {
            res.status(200).json(book);
        } else {
            res.status(404).json({ error: 'Book not found' });
        }
    } catch (error) {
        console.error('Error getting book by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function find(req, res) {
    try {
        const filters = req.body;

        const books = await bookRepository.find(filters);

        if (books.length > 0) {
            res.status(200).json(books);
        } else {
            res.status(404).json({ error: 'No books found with the given criteria' });
        }
    } catch (error) {
        console.error('Error getting books by filters:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function update(req, res) {
    const id = req.params.id;
    const { price, title, author, quantity } = req.body
    const book = await bookRepository.findBookById(id);

    if (!book) {
        res.status(404).json({ message: "not found" });
    }
    const updatedBookData = {
        price,
        title,
        author,
        quantity
    };
    await bookRepository.updateBook(id, updatedBookData);

    res.status(200).json({ message: "updated successfully", book });

}


module.exports = { createBook, findBookById, find, update };
