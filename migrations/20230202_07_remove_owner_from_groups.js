module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.removeColumn('groups', 'owner')
    }
}