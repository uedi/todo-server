const { DataTypes } = require('sequelize')

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.addColumn('memberships', 'pending', {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        })
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.removeColumn('memberships', 'pending')
    }
}