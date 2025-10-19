import { where } from "sequelize";
import { User } from "../models/index.js";
import bcrypt from "bcrypt";

export async function createController(req, res) {
  try {
    const { nome, email, senha } = req.body;
    const hashedSenha = await bcrypt.hash(senha, 10);

    const user = await User.create({
      nome,
      email,
      senha: hashedSenha,
    });

    res.status(201).json(user);
  } catch (error) {
    console.log("criando acc", error);
    res.status(400).json({ error: error.message });
  }
}

export async function readController(req, res) {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function changePasswordController(req, res) {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.params.id;

    const validateError = validadePassword(oldPassword, newPassword);
    if (validateError) {
      return res.status(400).json({ error: validateError });
    }

    const user = await User.findByPk(userId, {
      attributes: ["id", "nome", "email", "senha"],
    });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const result = await verifyPasswords(oldPassword, newPassword, user.senha);
    if (!result.validator) {
      return res.status(400).json({ error: result.error });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ senha: hashedPassword });

    return res.status(200).json({ message: "Senha atualizada com sucesso" });

    async function verifyPasswords(oldPassword, newPassword, hashedPassword) {
      const match = await bcrypt.compare(oldPassword, hashedPassword);
      if (!match) {
        return { validator: false, error: "Senha antiga incorreta" };
      }

      const samePasswords = await bcrypt.compare(newPassword, hashedPassword);
      if (samePasswords) {
        return {
          validator: false,
          error: "A nova senha não pode ser igual a antiga",
        };
      }
      return { validator: true };
    }

    function validadePassword(oldPassword, newPassword) {
      if (!oldPassword || !newPassword) {
        return "As senhas não podem ser vazias";
      }
      if (oldPassword === newPassword) {
        return "A nova senha deve ser diferente da antiga";
      }
      if (newPassword.length < 6) {
        return "A nova senha deve ter pelo menos 6 caracteres";
      }
      return null;
    }
  } catch (error) {
    return res.status(500).json({ error: "Erro ao criar nova senha" });
  }
}

export async function updateController(req, res) {
  try {
    const [updated] = await User.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedUser = await User.findByPk(req.params.id);
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function getLoggedUserController(req, res) {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["senha"] },
    });
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteController(req, res) {
  try {
    const deleted = await User.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function listUsersController(req, res) {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
