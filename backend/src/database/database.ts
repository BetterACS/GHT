import dotenv from "dotenv";
// import mysql from "mysql2";
import mongoose from "mongoose";

dotenv.config();

export class Database {
  private static INSTANCE: Database;
  // private static mySQLConnection: mysql.Connection;
  private static mongoDBConnection: unknown;

  private constructor() {
    // this.mySQLConnect();
    this.mongoDBConnect();
  }

  // private mySQLConnect() {
  //   Database.mySQLConnection = mysql.createConnection(process.env.MYSQL_URI!);
  //   Database.mySQLConnection.connect((error: any) => {
  //     if (error) {
  //       console.log("[Server] Failed to connect to database");
  //       console.log(error);
  //       return;
  //     }
  //     console.log("[Server] Connected to database");
  //   });
  // }

  private mongoDBConnect() {
    Database.mongoDBConnection = mongoose
      .connect(process.env.MONGODB_URI!)
      .then(() => {
        console.log("[Server] Connected to MongoDB");
      })
      .catch((error) => {
        console.log("[Server] Failed to connect to MongoDB");
        console.log(error);
      });
  }

  // public mySQL() {
  //   return Database.mySQLConnection;
  // }

  public mongoDB() {
    return Database.mongoDBConnection;
  }

  public static instance() {
    if (!Database.INSTANCE) {
      Database.INSTANCE = new Database();
    }
    return Database.INSTANCE;
  }
}
