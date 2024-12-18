import formData from 'form-data';
import Mailgun from 'mailgun.js';
import { encrypt, decrypt } from '../utils/encryption';

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY || '',
  url: 'https://api.mailgun.net',
});

const DOMAIN = process.env.MAILGUN_DOMAIN || '';
const FROM_EMAIL = `DAFI <noreply@${DOMAIN}>`;

interface EmailTemplate {
  subject: string;
  html: string;
}

export const generateVerificationToken = async (email: string): Promise<string> => {
  const timestamp = Date.now();
  const token = await encrypt(`${email}:${timestamp}`);
  return encodeURIComponent(token);
};

export const verifyEmailToken = async (token: string): Promise<{ email: string; isValid: boolean }> => {
  try {
    const decodedToken = decodeURIComponent(token);
    const decrypted = await decrypt(decodedToken);
    const [email, timestamp] = decrypted.split(':');
    const tokenTime = parseInt(timestamp);
    const currentTime = Date.now();
    const thirtyMinutes = 30 * 60 * 1000;
    
    return {
      email,
      isValid: currentTime - tokenTime <= thirtyMinutes,
    };
  } catch (error) {
    return { email: '', isValid: false };
  }
};

export const generateTempPassword = (): string => {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  
  return password;
};

const getEmailVerificationTemplate = (verificationLink: string): EmailTemplate => ({
  subject: 'Welcome to DAFI - Verify Your Email',
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          border-radius: 15px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        .content {
          padding: 30px;
          background: white;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background: linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%);
          color: white;
          text-decoration: none;
          border-radius: 25px;
          font-weight: bold;
          margin: 20px 0;
          transition: transform 0.3s ease;
        }
        .button:hover {
          transform: translateY(-2px);
        }
        .footer {
          text-align: center;
          padding: 20px;
          color: #666;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://dafi.com/logo.png" alt="DAFI Logo" style="width: 150px; margin-bottom: 20px;">
          <h1 style="margin: 0;">Welcome to DAFI</h1>
        </div>
        <div class="content">
          <h2>Verify Your Email Address</h2>
          <p>Thank you for joining DAFI - your gateway to decentralized agricultural finance. To get started, please verify your email address by clicking the button below:</p>
          <div style="text-align: center;">
            <a href="${verificationLink}" class="button">Verify Email Address</a>
          </div>
          <p>This verification link will expire in 30 minutes for security reasons.</p>
          <p>If you didn't create an account with DAFI, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>© 2024 DAFI. All rights reserved.</p>
          <p>This is an automated message, please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `,
});

const getPasswordResetTemplate = (tempPassword: string): EmailTemplate => ({
  subject: 'DAFI - Your Temporary Password',
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          border-radius: 15px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        .content {
          padding: 30px;
          background: white;
        }
        .password-box {
          background: #f8f9fa;
          border: 2px dashed #2E7D32;
          border-radius: 10px;
          padding: 15px;
          margin: 20px 0;
          text-align: center;
          font-family: monospace;
          font-size: 18px;
        }
        .footer {
          text-align: center;
          padding: 20px;
          color: #666;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://dafi.com/logo.png" alt="DAFI Logo" style="width: 150px; margin-bottom: 20px;">
          <h1 style="margin: 0;">Password Reset</h1>
        </div>
        <div class="content">
          <h2>Your Temporary Password</h2>
          <p>You recently requested to reset your password. Here's your temporary password:</p>
          <div class="password-box">
            ${tempPassword}
          </div>
          <p><strong>Important:</strong> This temporary password will expire in 30 minutes. Please log in and change your password immediately.</p>
          <p>If you didn't request a password reset, please contact our support team immediately.</p>
        </div>
        <div class="footer">
          <p>© 2024 DAFI. All rights reserved.</p>
          <p>This is an automated message, please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `,
});

export const sendVerificationEmail = async (email: string, verificationToken: string): Promise<boolean> => {
  const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${verificationToken}`;
  const template = getEmailVerificationTemplate(verificationLink);

  try {
    await mg.messages.create(DOMAIN, {
      from: FROM_EMAIL,
      to: email,
      subject: template.subject,
      html: template.html,
    });
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
};

export const sendPasswordResetEmail = async (email: string, tempPassword: string): Promise<boolean> => {
  const template = getPasswordResetTemplate(tempPassword);

  try {
    await mg.messages.create(DOMAIN, {
      from: FROM_EMAIL,
      to: email,
      subject: template.subject,
      html: template.html,
    });
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
};
