const sql = require('mssql')
const connectionPool = require('../config/dbconfig')

async function saveBook(book) {

    try {
        const query = `
        INSERT INTO BOOKS (quantity,price,title,author)
        VALUES (@quantity,@price,@title,@author)
        `
        const pool = await connectionPool;
        const result = await pool.request()
            .input('quantity', sql.Int, book.quantity)
            .input('price', sql.Decimal(10, 2), book.price)
            .input('title', sql.NVarChar(255), book.title)
            .input('author', sql.NVarChar(255), book.author)
            .query(query);

        console.log(result.recordset[0])

        return result;

    } catch (error) {
        console.error('Error saving book in the database:', error);
        throw error;
    } finally {
        sql.close();
    }
}

async function findBookById(bookId) {
    try {
        const pool = await connectionPool;

        const query = `
            SELECT * FROM Books
            WHERE id = @bookId;
        `;

        const result = await pool.request()
            .input('bookId', sql.Int, bookId)
            .query(query);

        return result.recordset[0];
    } catch (error) {
        console.error('Error finding book by ID in the database:', error);
        throw error;
    } finally {
        sql.close();
    }
}
async function updateBook(id, book) {
    try {
        const pool = await connectionPool;
        const { title, author, price, quantity } = book;
        let updateQuery = 'UPDATE Books SET ';
        const queryParams = {};

        if (title) {
            updateQuery += 'title = @updatedTitle, ';
            queryParams.updatedTitle = title;
        }
        if (author) {
            updateQuery += 'author = @updatedAuthor, ';
            queryParams.updatedAuthor = author;
        }
        if (price) {
            updateQuery += 'price = @updatedPrice, ';
            queryParams.updatedPrice = price;
        }
        if (quantity) {
            updateQuery += 'quantity = @updatedQuantity, ';
            queryParams.updatedQuantity = quantity;
        }

        if (updateQuery.endsWith(', ')) {
            updateQuery = updateQuery.slice(0, -2);
        } else {
            console.warn('No fields provided for update.');
            return null;
        }

        updateQuery += ' WHERE id = @id;';

        await pool
            .request()
            .input('id', sql.Int, id)
            .input('updatedQuantity', sql.Int, queryParams.updatedQuantity)
            .input('updatedTitle', queryParams.updatedTitle)
            .input('updatedAuthor', queryParams.updatedAuthor)
            .input('updatedPrice', sql.Decimal(10, 2), queryParams.updatedPrice)
            .query(updateQuery);

    } catch (error) {
        console.error('Error updating book in the database:', error);
        throw error;
    } finally {
        sql.close();
    }
}

async function find(filters) {
    try {
        const pool = await connectionPool;

        const conditions = Object.keys(filters).map(key => `${key} = @${key}`);
        const whereClause = conditions.length > 0
            ?
            `WHERE ${conditions.join(' AND ')}`
            : '';

        const query = `
            SELECT author,price,title FROM Books
            ${whereClause};
        `;

        const request = pool.request();

        Object.keys(filters).forEach(key => {
            if (key === 'price') {
                request.input(key, sql.Decimal(10, 2), filters[key]);
            } else {
                request.input(key, sql.NVarChar(255), filters[key]);
            }
        });
        const result = await request.query(query);

        return result.recordset;
    } catch (error) {
        console.error('Error finding books in the database:', error);
        throw error;
    } finally {
        sql.close();
    }
}
module.exports = {
    saveBook,
    findBookById,
    find,
    updateBook
}



