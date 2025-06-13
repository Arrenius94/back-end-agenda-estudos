import { User } from "../models/index.js";

export async function loginController(req, res) {
  console.log("LOGIN");

  const { email, senha } = req.body;
  console.log("email", email);
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }
    if (user.senha !== senha) {
      return res.status(401).json({ error: "Senha incorreta" });
    }
    // Aqui você pode gerar um token JWT se quiser autenticação real
    res.status(200).json({ message: "Login realizado com sucesso", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
