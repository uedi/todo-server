const { Membership, List, Group, Todo, User, Contact } = require('../models')
const jwt = require('jsonwebtoken')

const isGroupMember = async (groupId, userId) => {
    if(!groupId || !userId) {
        return false
    }

    const accessToGroup = await Membership.findOne({
        where: {
            groupId: groupId,
            userId: userId
        }
    })
    return accessToGroup ? true : false
}

const isGroupOwner = async (groupId, userId) => {
    if(!groupId || !userId) {
        return false
    }

    const ownerAccess = await Membership.findOne({
        where: {
            groupId: groupId,
            userId: userId,
            owner: true
        }
    })

    return ownerAccess ? true : false
}

const hasListAccess = async (listId, userId) => {
    if(!listId || !userId) {
        return false
    }

    const accessToList = (await List.findByPk(listId))?.userId === userId
    return accessToList ? true : false
}

const getContact = async (contactId, userId) => {
    if(!contactId || !userId) {
        return null
    }

    const contact = await Contact.findOne({
        where: {
            userId: userId,
            contactId: contactId
        }
    })

    return contact
}

const getGroupResponse = async (groupId, userId) => {
    const savedGroup = await Group.findByPk(groupId, {
        include: [{
            model: User, as: 'users',
            attributes: ['name', 'username', 'id']
        }, {
            model: Todo
        }]
    })
    const membership = await Membership.findOne({
        where: {
            groupId: groupId,
            userId: userId,
        }
    })
    const groupToSend = {
        ...savedGroup.toJSON(),
        membership: membership.toJSON()
    }
    return groupToSend
}

const userWithTokenResponse = (user) => {
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.TOKEN_DATA)
    return ({
        token,
        user: {
            id: user.id,
            username: user.username,
            name: user.name
        }
    })
}

module.exports = {
    isGroupMember, hasListAccess, isGroupOwner, getGroupResponse, getContact, userWithTokenResponse
}
