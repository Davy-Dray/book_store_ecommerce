const sql = require('mssql');
const User = require('./user');
const connectionPool = require('../config/dbconfig');

async function save(user) {
    try {
        const query = `
      INSERT INTO Users (email, password)
      VALUES (@email, @password);
    `;

        const pool = await connectionPool;

        const result = await pool.request()
            .input('email', user.email)
            .input('password', user.password)
            .query(query);
        return result;
    } catch (error) {
        console.error('Error creating user in the database:', error);
        throw error;
    } finally {
        sql.close();

    }
}
async function findByEmail(email) {
    try {
        const query = `
        SELECT id, email, password
        FROM Users
        WHERE email = @email;
      `;
        const pool = await connectionPool;

        const result = await pool.request()
            .input('email', email)
            .query(query);

        const userData = result.recordset[0];

        if (!userData) {
            return null;
        }
        const user = new User(userData.email, userData.password);

        return user;
    } catch (error) {
        console.error('Error fetching user by email:', error);
        throw error;
    } finally {
        sql.close();

    }

}
async function findAllUsers() {
    try {
        const pool = await connectionPool;
        const result = await pool.request()
            .query("SELECT * FROM dbo.users");
        return result.recordsets[0];

    } catch (err) {
        console.error('Error executing SQL statement:', err);
        throw err;
    } finally {
        sql.close();
    }
}

async function updateUser(user) {
    try {
        const pool = await connectionPool;
        const { email, updatedEmail, updatedPassword } = user;
        let updateQuery;
        if (updatedEmail) {
            updateQuery = `
        UPDATE Users
        SET email = @updatedEmail
        WHERE email = @email;
      `;
        }
        if (updatedPassword) {
            updateQuery = `
            UPDATE Users
            SET password = @updatedPassword
            WHERE email = @email;
          `;
        }
        await pool
            .request()
            .input('email', email)
            .input('updatedEmail', updatedEmail)
            .input('updatedPassword', updatedPassword)
            .query(updateQuery);

    } catch (error) {
        console.error('Error updating user in the database:', error);
        throw error;
    } finally {
        sql.close();
    }
}


module.exports = { save, findByEmail, findAllUsers, updateUser };
