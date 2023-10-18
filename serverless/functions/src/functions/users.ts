import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";

import mysql from "mysql2";

const pool = mysql.createPool({
  host: "mt-sqlserver.mysql.database.azure.com",
  database: "mt-mysqldb",
  user: "masterthesis",
  password: "secretpassword",
});

export async function users(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  const name = request.query.get("name") || (await request.text()) || "world";

  return { body: `Hello, ${name}!` };
}

app.http("users", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: users,
});
