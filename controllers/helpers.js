const { Membership } = require('../models')

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

module.exports = {
    isGroupMember
}
