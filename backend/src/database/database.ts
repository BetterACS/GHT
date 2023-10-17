import dotenv from "dotenv";
import mysql from "mysql2";

dotenv.config();

// export function get_database_connection() {
//   return mysql.createConnection(CONNECTION_URI);
// }

export class Database {
  private static INSTANCE: Database;
  private static connection: mysql.Connection;

  private constructor() {
    Database.connection = mysql.createConnection(this.get_uri());
    this.connect();
  }

  private connect() {
    Database.connection.connect((error: any) => {
      if (error) {
        console.log("[Server] Failed to connect to database");
        console.log(error);
        return;
      }
      console.log("[Server] Connected to database");
    });
  }

  public static instance() {
    if (!Database.INSTANCE) {
      Database.INSTANCE = new Database();
    }
    return Database.INSTANCE;
  }

  public get_connection() {
    return Database.connection;
  }

  public get_uri() {
    const CONNECTION_URI =
      `mysql://${process.env.MYSQL_USER}:${process.env.MYSQL_PASSWORD}@` +
      `${process.env.MYSQL_HOST}:${process.env.MYSQL_PORT}/gamify_habit_tracker`;
    return CONNECTION_URI;
  }
}
