const mysql = require("mysql")
const express = require("express")
const app = express()
var mysqlconnection = mysql.createConnection(
    {
        host: 'by59qgkgtip5p358uwli-mysql.services.clever-cloud.com',
        user: 'ugpgztx7leeszzit',
        password: 'JyYlZ2HheQD5e8zt82Ho',
        database: 'by59qgkgtip5p358uwli'
    }
);
module.exports = mysqlconnection

// mysql://ugpgztx7leeszzit:JyYlZ2HheQD5e8zt82Ho@by59qgkgtip5p358uwli-mysql.services.clever-cloud.com:3306/by59qgkgtip5p358uwli