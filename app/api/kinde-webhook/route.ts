import { NextResponse } from "next/server";
import jwksClient from "jwks-rsa";
import jwt, { JwtPayload } from "jsonwebtoken";
import { createClient } from "@tursodatabase/api";
import md5 from "md5";

const turso = createClient({
  token: process.env.TURSO_API_TOKEN!,
  org: process.env.TURSO_ORG!,
});

// The Kinde issuer URL should already be in your `.env` file
// from when you initially set up Kinde. This will fetch your
// public JSON web keys file
const client = jwksClient({
  jwksUri: `${process.env.KINDE_ISSUER_URL}/.well-known/jwks.json`,
});

export async function POST(req: Request) {
  console.log('inside webhook')
  try {
    // Get the token from the request
    const token = await req.text();

    // Decode the token
    const { header } = jwt.decode(token, { complete: true })!;
    const { kid } = header;

    // Verify the token
    const key = await client.getSigningKey(kid);
    const signingKey = key.getPublicKey();
    const event = await jwt.verify(token, signingKey) as JwtPayload;

    // Handle various events
    console.log(event.type, event.data);
    switch (event?.type) {
      case "user.created":
        const dbName = md5(event.data.user.id);
        await turso.databases.create(dbName, {
          schema: process.env.TURSO_DATABASE_NAME!,
          group: process.env.TURSO_GROUP,
        });
        break;
      case "organization.created":
        console.log('organization created');
        break;
      default:
        // other events that we don't handle
        console.log("Unhandled event type:", event.type, event.data);
        break;
    }

  } catch (err) {
    console.log('catch on webhook', err)
    if (err instanceof Error) {
      console.error(err.message);
      return NextResponse.json({ message: err.message }, { status: 400 });
    }
  }
  return NextResponse.json({ status: 200, statusText: "success" });
}
