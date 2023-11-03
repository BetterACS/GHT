import mysql, { Pool } from "mysql";

const db: Pool = mysql.createPool({
    connectionLimit: 100,
    host: "localhost", // You can use "localhost" or "127.0.0.1"
    user: "Admin", // Make sure this username matches your MySQL user
    password: "monjackkim", // Password for the MySQL user
    database: "gmt", // Database name
    port: 3306 // No need for quotes around port number
});

export default db;