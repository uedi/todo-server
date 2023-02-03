const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class Message extends Model {}

Message.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    groupId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'groups', key: 'id' },
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        primaryKey: true
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'message'
})

module.exports = Message