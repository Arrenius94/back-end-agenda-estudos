const express = require("express");
const {
  createController,
  readController,
  updateController,
  deleteController,
  changePasswordController,
  listUsersController,
  getLoggedUserController,
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
router.put("/users/:id/change-password", changePasswordController);
router.delete("/users/:id", deleteController);
router.get("/users", listUsersController);
router.post("/login", loginController);
router.get("/me", verifyToken, getLoggedUserController);

// ROTAS TAREFAS
router.post("/tarefas", verifyToken, createTarefaController);
router.get("/tarefas", verifyToken, listTarefasController);
router.get("/tarefas/:id", verifyToken, readTarefaController);
router.put("/tarefas/:id", updateTarefaController);
router.delete("/tarefas/:id", deleteTarefaController);

module.exports = router;
