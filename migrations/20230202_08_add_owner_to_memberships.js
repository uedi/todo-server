const { DataTypes } = require('sequelize')

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.addColumn('memberships', 'owner', {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        })
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.removeColumn('memberships', 'owner')
    }
}