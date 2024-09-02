import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getDumpUrl } from "@/app/utils";

export async function GET() {
  const user = await getKindeServerSession()?.getUser();
  if (!user) return new Response("Not authenticated", { status: 401 });

  const url = await getDumpUrl();

  if (!url) return new Response("No data yet");

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.TURSO_GROUP_AUTH_TOKEN}`,
      },
    });

    if (response.ok) {
      const text = await response.text();

      return new Response(text);
    }

    return new Response("No data yet");
  } catch (err) {
    console.log("Could not download dump");
    return new Response("Could not download dump", { status: 500 });
  }
}
