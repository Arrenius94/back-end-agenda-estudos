import nodemailer from "nodemailer";
import { User } from "../models/index.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const configuracaoEmail = {
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
};

// Função que envia o email
export async function enviarEmail(destinatario, novaSenha) {
  // Cria o transportador de email
  const transportador = nodemailer.createTransport(configuracaoEmail);

  // Configura a mensagem
  const mensagem = {
    from: "agenda-estudos-contato@gmail.com",
    to: destinatario,
    subject: "Sua Nova Senha",
    text: `Sua nova senha é: ${novaSenha}`,
    html: `<p>Sua nova senha é: <strong>${novaSenha}</strong></p>`,
  };

  return transportador.sendMail(mensagem);
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
