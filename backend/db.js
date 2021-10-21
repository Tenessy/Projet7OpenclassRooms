const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '36370998',
    database: 'groupomania',
});

connection.connect(function (error) {
    if (error) {
        throw error;
    }
    else {
        console.log("Connection à mysql réussie !")
    }
});

module.exports = connection;