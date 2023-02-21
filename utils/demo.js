const { connectToDatabase, closeDatabaseConnection } = require('./db')
const { User, Group, List, Todo, Contact, Membership, Message } = require('../models')
const { users } = require('./demodata')
const bcrypt = require('bcrypt')

const clearDb = async () => {
    await Message.destroy({ where: {}})
    await Membership.destroy({ where: {}})
    await Todo.destroy({ where: {}})
    await List.destroy({ where: {}})
    await Contact.destroy({ where: {}})
    await Group.destroy({ where: {}})
    await User.destroy({ where: {}})
}

const createUser = async (data) => {
    const password = 'testaaja'
    const saltrounds = 10
    const passwordHash = await bcrypt.hash(password, saltrounds)
    const user = await User.create({ ...data, passwordHash })
    return { id: user.id, username: user.username, name: user.name }
}

const createLists = async (user) => {
    const id = user.id
    const normalList = await List.create({ name: 'My List', userId: id })
    const pinkList = await List.create({ name: 'My Pink List', userId: id, color: '#f8bbd0' })
    const myBlueList = await List.create({ name: 'My Blue List', userId: id, color: '#bbdefb'})
}

const createGroups = async (user, members = []) => {
    const id = user.id
    const emptyGroup = await Group.create({ name: 'Empty Group' })
    const group1 = await Group.create({ name: 'Group 1', color: '#b3e5fc' })
    const group2 = await Group.create({ name: 'Group 2' })
    await Membership.create({ groupId: emptyGroup.id, userId: id, owner: true })
    await Membership.create({ groupId: group1.id, userId: id, owner: true })
    await Membership.create({ groupId: group2.id, userId: id, owner: true })

    for (m of members) {
        await Membership.create({ groupId: group1.id, userId: m.id, pending: false })
        await Membership.create({ groupId: group2.id, userId: m.id, pending: false })
    }
}

const addContacts = async (user, contacts = []) => {
    for (m of contacts) {
        await Contact.create({ userId: user.id, contactId: m.id, name: m.name })
    }
}

const addContactWithColor = async (user, contact, color) => {
    await Contact.create({ userId: user.id, contactId: contact.id, name: contact.name, color: color })
}

const inviteToGroup = async (user, heroes) => {
    const group = await Group.create({ name: `${user.name}'s group` })
    await Membership.create({ groupId: group.id, userId: user.id, owner: true, pending: false })
    for (h of heroes) {
        await Membership.create({ groupId: group.id, userId: h.id, owner: false, pending: true })
    }
}

const initDemo = async () => {
    await connectToDatabase()
    await clearDb()

    const heroes = []
    const groupMembers = []
    const contacts = []
    const bruce = await createUser(users[14])

    for (let i = 0; i <= 5; i++) {
        const u = await createUser(users[i])
        heroes.push(u)
    }

    for (let i = 6; i <= 9; i++) {
        const u = await createUser(users[i])
        groupMembers.push(u)
    }

    for (let i = 10; i <= 13; i++) {
        const u = await createUser(users[i])
        contacts.push(u)
    }

    for (let i = 0; i < heroes.length; i++) {
        await createLists(heroes[i])
        await createGroups(heroes[i], groupMembers)
        await addContacts(heroes[i], contacts)
        await addContactWithColor(heroes[i], bruce, '#c8e6c9')
    }

    await inviteToGroup(bruce, heroes)

    await closeDatabaseConnection()
}

initDemo()