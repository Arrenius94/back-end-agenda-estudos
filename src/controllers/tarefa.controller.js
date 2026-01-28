import { Tarefa } from "../models/index.js";
import { Op, fn, col, where } from "sequelize"; // ou require se não usa ESModules

// ...existing user controllers...

// Criar tarefa
export async function createTarefaController(req, res) {
  try {
    // console.log("req.body recebido:", req.body); // <-- Adicione aqui
    const dataError = IsDateValid(req.body.data_conclusao);
    if (dataError) {
      return res.status(400).json({ error: dataError });
    }

    const tarefa = await Tarefa.create({
      ...req.body,
      users_id: req.user.id,
    });
    res.status(201).json(tarefa);
  } catch (error) {
    console.error("Erro detalhado no terminal:", error);
    const mensagemErro =
      error.parent?.sqlMessage || error.message || "Erro desconhecido";
    res.status(400).json({ error: mensagemErro });
  }
}

function IsDateValid(date) {
  if (!date) return "Data de conclusão é obrigatória!";

  const [ano, mes, dia] = date.split("-");
  const inputDay = new Date(ano, mes - 1, dia, 12);

  const today = new Date();
  const todayDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    12,
  );

  if (inputDay.getTime() < todayDay.getTime()) {
    return "A data de conclusão não pode ser menor que a data atual!";
  }

  return null;
}

// Listar todas as tarefas
// export async function listTarefasController(req, res) {
//   try {
//     const search = req.query.search;

//     let tarefas;

//     if (search) {
//       tarefas = await Tarefa.findAll({
//         where: {
//           [Op.or]: [{ titulo: { [Op.like]: `%${search}%` } }, { descricao: { [Op.like]: `%${search}%` } }],
//         },
//       });
//     } else {
//       tarefas = await Tarefa.findAll();
//     }

//     res.status(200).json(tarefas);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// }

// Listar tarefas com ou sem filtro, usando paginação
export async function listTarefasController(req, res) {
  try {
    const search = req.query.search || "";
    const page = parseInt(req.query.page, 10) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;
    const users_id = req.query.user_id; // Recebe do front via query param

    let where = {};

    console.log("users_id:", users_id);

    if (users_id) {
      where.users_id = users_id;
    }

    if (search) {
      where = {
        ...where,
        [Op.or]: [
          { titulo: { [Op.iLike]: `%${search}%` } },
          { descricao: { [Op.iLike]: `%${search}%` } },
        ],
      };
    }

    const { count, rows } = await Tarefa.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      tarefas: rows,
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Buscar tarefa por ID
export async function readTarefaController(req, res) {
  try {
    const tarefa = await Tarefa.findByPk(req.params.id);
    if (tarefa) {
      res.status(200).json(tarefa);
    } else {
      res.status(404).json({ error: "Tarefa não encontrada" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

//BUSCAR TAREFA PELO TERMOS
export async function searchTarefasController(req, res) {
  try {
    const search = req.query.search || "";

    const tarefas = await Tarefa.findAll({
      where: {
        [Op.or]: [
          { titulo: { [Op.iLike]: `%${search}%` } },
          { descricao: { [Op.iLike]: `%${search}%` } },
        ],
      },
    });

    res.status(200).json(tarefas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

// Atualizar tarefa
export async function updateTarefaController(req, res) {
  try {
    const [updated] = await Tarefa.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedTarefa = await Tarefa.findByPk(req.params.id);
      res.status(200).json(updatedTarefa);
    } else {
      res.status(404).json({ error: "Tarefa não encontrada" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Deletar tarefa
export async function deleteTarefaController(req, res) {
  try {
    const deleted = await Tarefa.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Tarefa não encontrada" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
