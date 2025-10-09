const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

let sequelize;

if (process.env.NODE_ENV === "production") {
  // Conexão com NeonDB (produção)
  sequelize = new Sequelize(process.env.PROD_DB_URL, {
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
  });
} else {
  // Conexão local (desenvolvimento)
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      dialect: "postgres",
      logging: false,
    }
  );
}

// Testar conexão
sequelize
  .authenticate()
  .then(() =>
    console.log(
      `✅ Conectado ao banco (${
        process.env.NODE_ENV || "development"
      }) com sucesso!`
    )
  )
  .catch((err) => console.error("❌ Erro ao conectar:", err));

// Models
const User = sequelize.define(
  "Usuario",
  {
    nome: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    senha: { type: DataTypes.STRING, allowNull: false },
  },
  {
    tableName: "usuarios",
    timestamps: false,
  }
);

const Tarefa = sequelize.define(
  "Tarefa",
  {
    titulo: { type: DataTypes.STRING, allowNull: false },
    users_id: { type: DataTypes.STRING, allowNull: false },
    descricao: { type: DataTypes.TEXT, allowNull: true },
    horas_estudo: { type: DataTypes.STRING, allowNull: true },
    data_conclusao: { type: DataTypes.DATE, allowNull: true },
    observacoes: { type: DataTypes.TEXT, allowNull: true },
    updateAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "updateAt",
      defaultValue: Sequelize.NOW,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "createdAt",
      defaultValue: Sequelize.NOW,
    },
  },
  {
    tableName: "tarefas",
    timestamps: false,
  }
);

module.exports = { sequelize, User, Tarefa };
