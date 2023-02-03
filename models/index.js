const User = require('./user')
const Group = require('./group')
const List = require('./list')
const Todo = require('./todo')
const Contact = require('./contact')
const Membership = require('./membership')
const Message = require('./message')

User.hasMany(Contact, { foreignKey: 'user_id' })
Contact.belongsTo(User, { foreignKey: 'user_id' })

List.belongsTo(Group)
Group.hasMany(List)

List.belongsTo(User)
User.hasMany(List)

Todo.belongsTo(Group)
Group.hasMany(Todo)

Todo.belongsTo(List)
List.hasMany(Todo)

User.belongsToMany(Group, { through: Membership, as: 'groups' })
Group.belongsToMany(User, { through: Membership, as: 'users' })

Message.belongsTo(Group)
Group.hasMany(Message)

module.exports = {
    User, Group, List, Todo, Contact, Membership, Message
}