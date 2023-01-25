const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class List extends Model {}

List.init({
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
    modelName: 'list'
})

module.exports = List