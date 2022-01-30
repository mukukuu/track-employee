
//connect to db with mysql login info
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employee-tracker'

});

module.exports = db;
