import { Tarefa } from "../models/index.js";
import { Op } from "sequelize";

// ...existing user controllers...

// Criar tarefa
export async function createTarefaController(req, res) {
  try {
    if (!IsDateValid(req.body.data_conclusao)) {
      return res.status(400).json({ error: `Data de conclusão inválida!` });
    }

    const tarefa = await Tarefa.create(req.body);
    res.status(201).json(tarefa);
  } catch (error) {
    console.error("Erro ao criar tarefa:", error);
    res.status(400).json({ error: `Erro do catch!` });
  }
}

function IsDateValid(date) {
  const dateTime = Date.parse(date);
  if (isNaN(dateTime)) {
    return false;
  }
  if (dateTime <= Date.now) {
    return false;
  }
  return true;
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
        [Op.or]: [{ titulo: { [Op.like]: `%${search}%` } }, { descricao: { [Op.like]: `%${search}%` } }],
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
    const search = req.query.search || ""; // termo enviado pelo input, via query param

    const tarefas = await Tarefa.findAll({
      where: {
        [Op.or]: [
          {
            titulo: {
              [Op.like]: `%${search}%`,
            },
          },
          {
            descricao: {
              [Op.like]: `%${search}%`,
            },
          },
        ],
      },
    });

    res.status(200).json(tarefas);
  } catch (error) {
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
