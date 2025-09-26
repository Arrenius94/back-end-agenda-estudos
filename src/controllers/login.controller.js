import { User } from "../models/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { fn, col, where, Op } from "sequelize"; // precisa do Op

export async function loginController(req, res) {
  console.log("LOGIN");

  const { email, senha } = req.body;
  console.log("email", email);
  try {
    const user = await User.findOne({
      where: where(fn("LOWER", col("email")), { [Op.eq]: email.toLowerCase() }),
    });

    if (!user) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }

    const senhaValida = await bcrypt.compare(senha, user.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: "Senha incorreta" });
    }

    const token = jwt.sign({ id: user.id, email: user.email.toLowerCase() }, process.env.JWT_SECRET, {
      expiresIn: parseInt(process.env.JWT_EXPIRES),
    });

    res.status(200).json({ message: "Login realizado com sucesso", token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
