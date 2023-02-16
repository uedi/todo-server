const { Membership, List, Group, Todo, User } = require('../models')

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

module.exports = {
    isGroupMember, hasListAccess, isGroupOwner, getGroupResponse
}
