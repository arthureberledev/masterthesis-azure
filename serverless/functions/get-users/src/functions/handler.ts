import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import * as mysql from "mysql2";

const pool = mysql
  .createPool({
    host: "mt-db-server.mysql.database.azure.com",
    user: "mt_user",
    database: "mt_db",
    password: "secretpassword",
    connectionLimit: 100,
  })
  .promise();

export async function handler(
  _request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query("SELECT * FROM users");
    const users = rows || [];
    return {
      body: JSON.stringify(users),
      status: 200,
      headers: { "Content-Type": "application/json" },
    };
  } catch (error) {
    context.log(error);
    return { body: error.message, status: 500 };
  } finally {
    connection.release();
  }
}

app.http("getUsers", {
  route: "users",
  methods: ["GET"],
  authLevel: "anonymous",
  handler: handler,
});
