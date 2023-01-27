const { DataTypes } = require('sequelize')

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('todos', {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            list_id: {
                type: DataTypes.UUID,
                references: { model: 'lists', key: 'id' }
            },
            group_id: {
                type: DataTypes.UUID,
                references: { model: 'groups', key: 'id' }
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            start: {
                type: DataTypes.DATE,
            },
            end: {
                type: DataTypes.DATE,
            },
            done: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: false,
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
        await queryInterface.dropTable('todos')
    }
}