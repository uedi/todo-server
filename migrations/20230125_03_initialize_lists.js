const { DataTypes } = require('sequelize')

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('lists', {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            owner: {
                type: DataTypes.UUID,
                references: { model: 'users', key: 'id' }
            },
            group: {
                type: DataTypes.UUID,
                references: { model: 'groups', key: 'id' }
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: false
            }
        })
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.dropTable('lists')
    }
}