const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class Todo extends Model {}

Todo.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    start: {
        type: DataTypes.DATE,
    },
    end: {
        type: DataTypes.DATE,
    },
    done: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'todo'
})

module.exports = Todo