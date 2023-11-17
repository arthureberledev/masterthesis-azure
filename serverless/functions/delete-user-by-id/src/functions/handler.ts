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
    if (!id) {
      return {
        body: JSON.stringify({ message: "Bad Request" }),
        status: 400,
        headers: { "Content-Type": "application/json" },
      };
    }

    const [results] = (await connection.query(
      "DELETE FROM users WHERE id = ?",
      [id]
    )) as ResultSetHeader[];
    if (results.affectedRows === 0) {
      return {
        body: JSON.stringify({ message: "Not Found" }),
        status: 404,
        headers: { "Content-Type": "application/json" },
      };
    }

    return {
      status: 204,
    };
  } catch (error) {
    context.log(error);
    return {
      body: error.message,
      status: 500,
    };
  } finally {
    connection.release();
  }
}

app.http("handler", {
  route: "users/{id}",
  methods: ["DELETE"],
  authLevel: "anonymous",
  handler: handler,
});
