const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

let sequelize;

if (process.env.NODE_ENV === "production") {
  sequelize = new Sequelize(process.env.PROD_DB_URL, {
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
} else {
  sequelize = new Sequelize(process.env.DEV_DB_NAME, process.env.DEV_DB_USER, process.env.DEV_DB_PASS, {
    host: process.env.DEV_DB_HOST,
    dialect: process.env.DEV_DB_DIALECT,
    port: process.env.DEV_DB_PORT,
  });
}

// Testar conexão
sequelize
  .authenticate()
  .then(() => console.log(`Conectado ao banco (${process.env.NODE_ENV || "development"}) com sucesso!`))
  .catch((err) => console.error("Erro ao conectar:", err));
// Define models
const User = sequelize.define("Usuario", {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Tarefa = sequelize.define(
  "Tarefa",
  {
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    users_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    horas_estudo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    data_conclusao: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    observacoes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    updateAt: {
      // 👈 Atenção: não é "updatedAt"
      type: DataTypes.DATE,
      allowNull: true,
      field: "updateAt", // define explicitamente o nome no banco
      defaultValue: Sequelize.NOW, // Valor padrão
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "createdAt", // também pode ser explícito
      defaultValue: Sequelize.NOW, // Valor padrão
    },
  },
  {
    tableName: "tarefas",
    timestamps: false, // 👈 ESSENCIAL para não gerar erro com 'updatedAt'
  }
);

// Add associations if needed
// User.hasMany(Post); // Example of association

// Export models
module.exports = {
  sequelize,
  User,
  Tarefa,
  // Add other models here
};
