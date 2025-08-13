const { Sequelize, DataTypes } = require("sequelize");
const config = require("../../config/config.json");
console.log("config:", config.development);
// Initialize Sequelize
console.log(
  config.development.database,
  config.development.username,
  config.development.password,
  config.development.host
);
const sequelize = new Sequelize(config.development.database, config.development.username, config.development.password, {
  host: config.development.host,
  dialect: "mysql", // or 'postgres', 'sqlite', etc.
});

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
