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
    },
    color: {
        type: DataTypes.STRING,
        defaultValue: '#ffffff',
        length: 7
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'list'
})

module.exports = List