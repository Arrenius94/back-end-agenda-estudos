import { User } from "../models/index.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();
console.log("FROM_ADDRESS:", process.env.FROM_ADDRESS);

// Configura o transporter via variáveis de ambiente (EMAIL_*)
// Em produção preferir 465/SSL; em dev, 587/STARTTLS
const isProd = process.env.NODE_ENV === "production";
const defaultPort = isProd ? 465 : 587;
const smtpPort = Number(process.env.EMAIL_PORT || defaultPort);
const smtpSecure =
  process.env.EMAIL_SECURE !== undefined
    ? process.env.EMAIL_SECURE === "true"
    : smtpPort === 465;

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error("EMAIL_USER/EMAIL_PASS não configurados.");
}

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.titan.email",
  port: smtpPort,
  secure: smtpSecure,
  requireTLS: !smtpSecure && smtpPort === 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: isProd ? {} : { rejectUnauthorized: false },
  pool: true,
  connectionTimeout: 8000,
  greetingTimeout: 6000,
  socketTimeout: 12000,
});

// Função que envia o email usando Resend
async function enviarEmail(destinatario, novaSenha) {
  try {
    // Falha rápida se credenciais ausentes
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("Credenciais SMTP ausentes (EMAIL_USER/EMAIL_PASS)");
    }
    await transporter.sendMail({
      from:
        process.env.FROM_ADDRESS ||
        `"Agenda Estudos" <${process.env.EMAIL_USER}>`,
      to: destinatario,
      subject: "Sua nova senha - Agenda Estudos",
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #333;">Olá!</h2>
        <p style="font-size: 16px; color: #555;">
          Você solicitou a redefinição de senha na Agenda Estudos.
        </p>
        <p style="font-size: 18px; color: #333; font-weight: bold;">
          Sua nova senha é: <span style="color: #2a9d8f;">${novaSenha}</span>
        </p>
        <p style="font-size: 14px; color: #777;">
          Recomendamos que você altere esta senha após o login para manter sua conta segura.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #aaa;">
          Este é um e-mail automático, por favor, não responda.
        </p>
      </div>
      `,
    });

    console.log("Email enviado com sucesso via SMTP");
  } catch (error) {
    console.error("Erro ao enviar email via SMTP:", error);
    throw error;
  }
}

export async function resetSenha(req, res) {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        erro: "Email não encontrado",
      });
    }

    const newPassword = Math.random().toString(36).slice(-8);

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({
      senha: hashedPassword,
    });

    await enviarEmail(email, newPassword);

    return res.status(200).json({
      mensagem: "Nova senha enviada para seu e-mail!",
    });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({
      erro: "Erro ao resetar senha!",
    });
  }
}
