const express = require("express");
const {
  createController,
  readController,
  updateController,
  deleteController,
  listUsersController,
} = require("../controllers/index");

const { loginController } = require("../controllers/login.controller");

const {
  createTarefaController,
  listTarefasController,
  readTarefaController,
  updateTarefaController,
  deleteTarefaController,
  searchTarefasController,
} = require("../controllers/tarefa.controller");

const { verifyToken } = require("../middlewares/auth");
const router = express.Router();

// ROTAS USUÁRIO
router.post("/users", createController);
router.get("/users/:id", readController);
router.put("/users/:id", updateController);
router.delete("/users/:id", deleteController);
router.get("/users", listUsersController);
router.post("/login", loginController);

// ROTAS TAREFAS
router.post("/tarefas", createTarefaController);
router.get("/tarefas", verifyToken, listTarefasController);
router.get("/tarefas/:id", verifyToken, readTarefaController);
router.put("/tarefas/:id", updateTarefaController);
router.delete("/tarefas/:id", deleteTarefaController);

module.exports = router;
