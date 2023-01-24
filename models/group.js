const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class Group extends Model {}

Group.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'group'
})

module.exports = Group