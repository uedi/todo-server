const User = require('./user')
const Group = require('./group')
const List = require('./list')

User.hasMany(Group, { foreignKey: 'owner' })
Group.belongsTo(User, { foreignKey: 'owner' })

List.belongsTo(Group)
Group.hasMany(List)

List.belongsTo(User)
User.hasMany(List)

module.exports = {
    User, Group, List
}