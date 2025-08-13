"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tarefas", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      titulo: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      descricao: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      data_conclusao: {
        type: Sequelize.DATEONLY, // DATE sem hora
        allowNull: false,
      },
      horas_estudo: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      updateAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      observacoes: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      users_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "usuarios", // nome da tabela referenciada
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("tarefas");
  },
};
