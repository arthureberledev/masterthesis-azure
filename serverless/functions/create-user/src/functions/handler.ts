import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";

import * as mysql from "mysql2";
import type { ResultSetHeader } from "mysql2";

const pool = mysql
  .createPool({
    host: "mt-sqlserver.mysql.database.azure.com",
    user: "masterthesis",
    database: "flexibleserverdb",
    password: "secretpassword",
    connectionLimit: 100,
  })
  .promise();

export async function handler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const connection = await pool.getConnection();
  try {
    const body = (await request.json()) as {
      name: string | undefined;
      email: string | undefined;
    };
    const name = body.name;
    const email = body.email;
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
        message:
          error instanceof Error ? error.message : "Internal Server Error",
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
