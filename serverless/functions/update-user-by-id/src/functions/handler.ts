import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";

import * as mysql from "mysql2";
import type { ResultSetHeader } from "mysql2/promise";

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
  const connection = await pool.getConnection();
  try {
    const id = request.params.id;
    const body = (await request.json()) as { name: string | undefined };
    const name = body.name;
    if (!id || !name) {
      return {
        body: JSON.stringify({ message: "Bad Request" }),
        status: 400,
        headers: { "Content-Type": "application/json" },
      };
    }

    const [results] = (await connection.query(
      "UPDATE users SET name = ? WHERE id = ?",
      [name, id]
    )) as ResultSetHeader[];

    if (results.affectedRows === 0) {
      return {
        body: JSON.stringify({ message: "Not Found" }),
        status: 404,
        headers: { "Content-Type": "application/json" },
      };
    }

    return {
      body: JSON.stringify({ id, ...body }),
      status: 200,
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
  route: "users/{id}",
  methods: ["PATCH"],
  authLevel: "anonymous",
  handler: handler,
});
