const sql = require('mssql');

const dbconfig = {
    server: 'localhost',
    user: 'sa',
    password: 'reallyStrongPwd123',
    database: 'BookStores',
    options: {
        encrypt: true,
        trustServerCertificate: true,
    },
    port: 1433,
};

const connectionPool = new sql.ConnectionPool(dbconfig)
    .connect()
    .then(pool => {
        console.log("connected")
        return pool;
    })


module.exports = connectionPool;