const { Membership, List } = require('../models')

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

module.exports = {
    isGroupMember, hasListAccess, isGroupOwner
}
