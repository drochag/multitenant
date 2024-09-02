import { redirect } from "next/navigation";
import { createClient } from "@tursodatabase/api";

import { checkDatabaseExists, getDatabaseName } from "../utils";

const turso = createClient({
  token: process.env.TURSO_API_TOKEN!,
  org: process.env.TURSO_ORG!,
});

export async function GET() {
  const databaseExists = await checkDatabaseExists();

  if (databaseExists) {
    return redirect("/dashboard");
  }

  const dbName = await getDatabaseName();

  if (!dbName) {
    console.error("No database name found for user");
    return redirect("/"); // Redirect to login
  }

  try {
    await turso.databases.create(dbName, {
      schema: process.env.TURSO_DATABASE_NAME!,
      group: process.env.TURSO_GROUP,
    });
  } catch (err) {
    console.error("Error processing webhook:", err);
    return new Response("Error occured", {
      status: 500,
    });
  }

  redirect("/dashboard");
}
