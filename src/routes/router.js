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
} = require("../controllers/tarefa.controller");

const router = express.Router();

router.post("/users", createController);
router.get("/users/:id", readController);
router.put("/users/:id", updateController);
router.delete("/users/:id", deleteController);
router.get("/users", listUsersController);
router.post("/login", loginController);
router.get("/tarefas", listTarefasController);
router.post("/tarefas", createTarefaController);

module.exports = router;
