const User = require('./user')
const Group = require('./group')
const List = require('./list')
const Todo = require('./todo')

User.hasMany(Group, { foreignKey: 'owner' })
Group.belongsTo(User, { foreignKey: 'owner' })

List.belongsTo(Group)
Group.hasMany(List)

List.belongsTo(User)
User.hasMany(List)

Todo.belongsTo(Group)
Group.hasMany(Todo)

Todo.belongsTo(List)
List.hasMany(Todo)

module.exports = {
    User, Group, List
}