import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";

import * as mysql from "mysql2";
import type { RowDataPacket } from "mysql2/promise";

const db = mysql
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
  const connection = await db.getConnection();
  try {
    const id = request.params.id;
    if (!id) {
      return {
        body: JSON.stringify({ message: "Bad Request" }),
        status: 400,
        headers: { "Content-Type": "application/json" },
      };
    }

    const [rows] = (await db.query("SELECT * FROM users WHERE id = ?", [
      id,
    ])) as RowDataPacket[];

    const user = rows[0];
    if (!user) {
      return {
        body: JSON.stringify({ message: "Not Found" }),
        status: 404,
        headers: { "Content-Type": "application/json" },
      };
    }
    return {
      body: JSON.stringify(user),
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
  methods: ["GET"],
  authLevel: "anonymous",
  handler: handler,
});
