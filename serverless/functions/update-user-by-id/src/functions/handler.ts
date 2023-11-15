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
    const id = request.params.id;
    const body = (await request.json()) as { email: string | undefined };
    const email = body.email;
    if (!id || !email) {
      return {
        body: JSON.stringify({ message: "Bad Request" }),
        status: 400,
        headers: { "Content-Type": "application/json" },
      };
    }

    const [results] = (await connection.query(
      "UPDATE users SET email = ? WHERE id = ?",
      [email, id]
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
