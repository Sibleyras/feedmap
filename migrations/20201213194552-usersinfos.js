'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    var DataTypes = Sequelize.DataTypes

    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING(64),
        allowNull: false
      },
      editor: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      superadmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      last_login: {
        type: DataTypes.DATE
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    })

    await queryInterface.createTable('infos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      latitude: {
        type: DataTypes.DOUBLE,
        allowNull: false
      },
      longitude: {
        type: DataTypes.DOUBLE,
        allowNull: false
      },
      marker: {
        type: DataTypes.STRING,
        allowNull: false
      },
      source: {
        type: DataTypes.STRING,
      },
      image: {
        type: DataTypes.STRING,
      },
      optJSON: {
        type: DataTypes.JSON
      },
      authorId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    })
    await queryInterface.addIndex('infos', { fields : ['createdAt'] })
    await queryInterface.addIndex('infos', { fields : ['marker'] })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('infos')
    await queryInterface.dropTable('users')
  }
};