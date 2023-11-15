import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";

import * as mysql from "mysql2";

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
    if (!id) {
      return {
        body: JSON.stringify({ message: "Bad Request" }),
        status: 400,
        headers: { "Content-Type": "application/json" },
      };
    }

    await connection.query("DELETE FROM users WHERE id = ?", [id]);

    return {
      body: "",
      status: 204,
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
  methods: ["DELETE"],
  authLevel: "anonymous",
  handler: handler,
});
