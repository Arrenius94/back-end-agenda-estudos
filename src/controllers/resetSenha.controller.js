import { User } from "../models/index.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();
console.log("FROM_ADDRESS:", process.env.FROM_ADDRESS);

// Configura o transporter via variáveis de ambiente (EMAIL_*)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.titan.email",
  port: Number(process.env.EMAIL_PORT) || 465,
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // timeouts to fail faster and give clearer logs
  connectionTimeout: Number(process.env.EMAIL_CONN_TIMEOUT) || 10000,
  greetingTimeout: Number(process.env.EMAIL_GREETING_TIMEOUT) || 10000,
  socketTimeout: Number(process.env.EMAIL_SOCKET_TIMEOUT) || 10000,
});

// Verifica a conexão SMTP no startup e loga o resultado.
transporter
  .verify()
  .then(() => {
    console.log("SMTP: conexão com servidor bem-sucedida");
  })
  .catch((err) => {
    console.error("SMTP: falha ao conectar/autorizar:", err);
  });

// Função que envia o email usando Resend
async function enviarEmail(destinatario, novaSenha) {
  try {
    await transporter.sendMail({
      from:
        process.env.FROM_ADDRESS ||
        `"Agenda Estudos" <${
          process.env.EMAIL_USER || "no-reply@example.com"
        }>`,
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

// Rota de teste para verificar conexão SMTP a partir do ambiente (Render)
export async function smtpTest(req, res) {
  try {
    await transporter.verify();
    return res.status(200).json({ ok: true, message: "SMTP OK" });
  } catch (err) {
    console.error("smtpTest error:", err);
    return res.status(500).json({ ok: false, error: err.message || err });
  }
}
