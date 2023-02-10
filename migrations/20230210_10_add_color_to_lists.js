const { DataTypes } = require('sequelize')

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.addColumn('lists', 'color', {
            type: DataTypes.STRING,
            defaultValue: '#ffffff',
            length: 7
        })
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.removeColumn('lists', 'color')
    }
}