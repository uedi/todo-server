const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class Contact extends Model {}

Contact.init({
    userId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    contactId: {
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
    modelName: 'contact'
})

module.exports = Contact