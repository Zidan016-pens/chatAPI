const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host : 'localhost', 
    user : 'root',
    password : '',
    database : 'userchat'
});

async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Connection to MySQL database was successful!');
        connection.release(); // release the connection back to the pool
    } catch (err) {
        console.error('Unable to connect to the MySQL database:', err.message);
    }
}

if (require.main === module) {
    testConnection();
}
module.exports = {
    pool, testConnection
};