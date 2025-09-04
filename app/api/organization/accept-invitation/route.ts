import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { invitationId } = body;

    if (!invitationId) {
      return NextResponse.json(
        { error: 'ID d\'invitation manquant' },
        { status: 400 }
      );
    }

    const data = await auth.api.acceptInvitation({
      body: {
        invitationId,
      },
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Erreur lors de l\'acceptation de l\'invitation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'acceptation de l\'invitation' },
      { status: 500 }
    );
  }
}