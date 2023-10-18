import mysql from "mysql2";
import fs from "fs";

import "dotenv/config";

let pool: mysql.Pool | null = null;

export function getDbPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      password: process.env.DB_PASS,
      port: 3306,
      ssl: {
        ca: fs.readFileSync(__dirname + "/cert.crt.pem"),
      },
      // /**
      //  * Determines the pool's action when no connections are available and the limit has been reached.
      //  * If true, the pool will queue the connection request and call it when one becomes available. If false, the pool will immediately call back with an error.
      //  */
      // waitForConnections: true,
      // /**
      //  * The maximum number of connections to create at once.
      //  */
      // connectionLimit: 100,
      // /**
      //  * The maximum number of idle connections. (Default: same as connectionLimit)
      //  */
      // maxIdle: 100,
      // /**
      //  * The idle connections timeout, in milliseconds.
      //  */
      // idleTimeout: 60000,
      // queueLimit: 0,
      // enableKeepAlive: true,
      // /**
      //  * If keep-alive is enabled users can supply an initial delay.
      //  */
      // keepAliveInitialDelay: 0,
    });
  }
  return pool.promise();
}
