import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

// Verify transporter configuration
transporter.verify((error: Error | null) => {
  if (error) {
    console.error('✗ Email transporter error:', error.message);
  } else {
    console.log('✓ Email server ready');
  }
});

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

// Send email
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const mailOptions = {
      from: `${process.env.SMTP_FROM_NAME || 'Verlanglijstje'} <${process.env.SMTP_FROM}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html || options.text.replace(/\n/g, '<br>')
    };

    await transporter.sendMail(mailOptions);
    console.log(`✓ Email sent to ${options.to}`);
    return true;
  } catch (error) {
    console.error('Email send error:', (error as Error).message);
    return false;
  }
}

// Send welcome email
export async function sendWelcomeEmail(to: string, name: string): Promise<boolean> {
  const subject = 'Welcome to Verlanglijstje.be!';
  const text = `Dear ${name},\n\nWelcome to Verlanglijstje.be!\n\nYou can now create wishlists, share them with friends and family, and follow other people's lists.\n\nBest regards,\nThe Verlanglijstje Team`;
  
  return sendEmail({ to, subject, text });
}

// Send password reset email
export async function sendPasswordResetEmail(to: string, name: string, resetToken: string): Promise<boolean> {
  const resetUrl = `${process.env.APP_URL || 'http://localhost:3000'}/#/reset-password?token=${resetToken}`;
  const subject = 'Password Reset Request';
  const text = `Dear ${name},\n\nYou requested to reset your password.\n\nClick the link below to reset your password:\n${resetUrl}\n\nIf you didn't request this, please ignore this email.\n\nBest regards,\nThe Verlanglijstje Team`;
  
  return sendEmail({ to, subject, text });
}

// Send share notification email
export async function sendShareEmail(
  to: string,
  fromName: string,
  listName: string,
  shareUrl: string,
  message?: string
): Promise<boolean> {
  const subject = `${fromName} shared a wishlist with you`;
  const text = `Dear friend,\n\n${fromName} wants to share their wishlist "${listName}" with you.\n\n${message ? `Message: ${message}\n\n` : ''}View the list here:\n${shareUrl}\n\nBest regards,\nVerlanglijstje.be`;
  
  return sendEmail({ to, subject, text });
}

export default { sendEmail, sendWelcomeEmail, sendPasswordResetEmail, sendShareEmail };
