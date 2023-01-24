const User = require('./user')
const Group = require('./group')

User.hasMany(Group, { foreignKey: 'owner' })
Group.belongsTo(User, { foreignKey: 'owner' })

module.exports = {
    User, Group
}