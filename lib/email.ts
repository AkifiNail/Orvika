// email.ts
import nodemailer from "nodemailer";

// Fonction pour envoyer une invitation par email
export async function sendOrganizationInvitation({
  email,
  invitedByUsername,
  invitedByEmail,
  teamName,
  inviteLink,
}: {
  email: string;
  invitedByUsername: string;
  invitedByEmail: string;
  teamName: string;
  inviteLink: string;
}) {
  // Configure ton transporteur SMTP
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, // true si port 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Envoie l'email
  await transporter.sendMail({
    from: `"${invitedByUsername}" <${invitedByEmail}>`,
    to: email,
    subject: `Invitation à rejoindre ${teamName}`,
    html: `
      <p>Bonjour,</p>
      <p>${invitedByUsername} vous a invité à rejoindre l'équipe <b>${teamName}</b>.</p>
      <p>Cliquez sur ce lien pour accepter l'invitation :</p>
      <p><a href="${inviteLink}">${inviteLink}</a></p>
      <p>À bientôt !</p>
    `,
  });

  console.log(`Invitation envoyée à ${email} pour rejoindre ${teamName}`);
}
