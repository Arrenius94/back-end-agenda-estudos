const express = require("express");
const { sequelize } = require("./src/models/index");

// Testar conexão
sequelize
  .authenticate()
  .then(() => console.log("Conectado ao NeonDB com sucesso!"))
  .catch((err) => console.error("Erro ao conectar:", err));

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => res.send("Backend funcionando!"));

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
