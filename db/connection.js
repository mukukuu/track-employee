const mysql = require('mysql2');


//connect to db with mysql login info
const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'AA123456aa!!',
    database: 'tracker'
});

// db.connect(err => {
//     if (err) throw err;
//     console.log('Database connected')});

db.connect(function (err) {
    if (err) throw err;
});

module.exports = db;
