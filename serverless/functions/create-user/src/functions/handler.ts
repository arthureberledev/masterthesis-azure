import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import * as mysql from "mysql2";
import type { ResultSetHeader, PoolConnection } from "mysql2/promise";

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
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  let connection: PoolConnection | null = null;

  try {
    connection = await pool.getConnection();
  } catch (error) {
    context.log(error);
    return {
      body: JSON.stringify({
        message: error.message || "Failed to connect to database",
      }),
      status: 500,
      headers: { "Content-Type": "application/json" },
    };
  }

  try {
    const body = (await request.json()) as {
      name: string | undefined;
      email: string | undefined;
    };
    const { name, email } = body;
    if (!name || !email) {
      return {
        body: JSON.stringify({ message: "Bad Request" }),
        status: 400,
        headers: { "Content-Type": "application/json" },
      };
    }

    const [results] = (await connection.query(
      "INSERT INTO users (name, email) VALUES (?, ?)",
      [name, email]
    )) as ResultSetHeader[];

    return {
      body: JSON.stringify({ id: results.insertId, name, email }),
      status: 201,
      headers: { "Content-Type": "application/json" },
    };
  } catch (error) {
    context.log(error);
    return {
      body: JSON.stringify({
        message: error.message || "Internal Server Error",
      }),
      status: 500,
      headers: { "Content-Type": "application/json" },
    };
  } finally {
    connection.release();
  }
}

app.http("handler", {
  route: "users",
  methods: ["POST"],
  authLevel: "anonymous",
  handler: handler,
});
