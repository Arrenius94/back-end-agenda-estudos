import { Tarefa } from "../models/index.js";

// ...existing user controllers...

// Criar tarefa
export async function createTarefaController(req, res) {
  try {
    const tarefa = await Tarefa.create(req.body);
    res.status(201).json(tarefa);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Listar todas as tarefas
export async function listTarefasController(req, res) {
  try {
    const tarefas = await Tarefa.findAll();
    res.status(200).json(tarefas);
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
