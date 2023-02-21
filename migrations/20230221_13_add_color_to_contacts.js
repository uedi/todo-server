const { DataTypes } = require('sequelize')

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.addColumn('contacts', 'color', {
            type: DataTypes.STRING,
            defaultValue: '#ffffff',
            length: 7
        })
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.removeColumn('contacts', 'color')
    }
}