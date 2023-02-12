const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class Membership extends Model {}

Membership.init({
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
    owner: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    pending: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'membership'
})

module.exports = Membership