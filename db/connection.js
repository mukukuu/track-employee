const mysql = require('mysql2');

//connect to db with mysql login info
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'tracker'

});
db.connect(err => {
    if (err) throw err;
    console.log('Database connected')});


module.exports = db;
