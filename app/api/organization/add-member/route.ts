// app/api/invite/route.ts
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Crée l’invitation côté Better Auth
    const invitation = await auth.api.createInvitation({
      body: {
        email: body.email,       
        role: body.role || "member",
        organizationId: body.organizationId,
        resend: body.resend || false,
      },
    });

    return new Response(JSON.stringify({ invitation }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Impossible de créer l'invitation" }), { status: 500 });
  }
}
