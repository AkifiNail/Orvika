import { NextRequest, NextResponse } from 'next/server';
import { sendOrganizationInvitation } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, invitedByUsername, invitedByEmail, teamName, inviteLink } = body;

    // Validation des données
    if (!email || !invitedByUsername || !invitedByEmail || !teamName || !inviteLink) {
      return NextResponse.json(
        { error: 'Données manquantes pour l\'envoi de l\'invitation' },
        { status: 400 }
      );
    }

    // Envoi de l'email
    await sendOrganizationInvitation({
      email,
      invitedByUsername,
      invitedByEmail,
      teamName,
      inviteLink,
    });

    return NextResponse.json({ success: true, message: 'Invitation envoyée avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'invitation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi de l\'invitation' },
      { status: 500 }
    );
  }
}
