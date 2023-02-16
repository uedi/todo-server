const groupRouter = require('express').Router()
const auth = require('../utils/auth')
const { Group, Membership, User, Message, Todo } = require('../models')
const { userExtractor } = require('../utils/middleware')
const { isGroupMember, isGroupOwner, getGroupResponse } = require('./helpers')

groupRouter.get('/', auth, userExtractor, async (req, res) => {
    const user = await User.findByPk(req.savedUser.id, {
        include: {
            model: Group, as: 'groups',
            include: [{
                model: User, as: 'users',
                attributes: ['name', 'username', 'id']
            }, {
                model: Todo
            }]
        },
        attributes: ['username']
    })
    const groups = user?.groups || []
    const groupsToSend = groups.filter(g => !g.membership.pending)
    return res.status(200).json(groupsToSend)
})

groupRouter.post('/', auth, userExtractor, async (req, res) => {
    const body = req.body

    if(!body?.name) {
        return res.status(400).end()
    }

    const groupToCreate = {
        name: body.name
    }

    if(body.color) {
        groupToCreate.color = body.color
    }

    const newGroup = await Group.create(groupToCreate)

    await Membership.create({
        groupId: newGroup.id,
        userId: req.savedUser.id,
        owner: true
    })

    const groupToSend = await getGroupResponse(newGroup.id, req.savedUser.id)
    return res.status(201).json(groupToSend)
})

groupRouter.post('/:id/members', auth, userExtractor, async (req, res) => {
    const body = req.body

    if(!body?.contactId) {
        return res.status(400).end()
    }

    const group = await Group.findByPk(req.params.id, { attributes: ['id'] })
    const user = await User.findByPk(body.contactId, { attributes: ['id'] })

    if(!group || !user) {
        return res.status(400).end()
    }

    const accessToGroup = await isGroupOwner(group.id, req.savedUser.id)

    if(!accessToGroup) {
        return res.status(403).json({ error: 'Only owner can add new members' })
    }

    const isMember = await Membership.findOne({ where: {
        groupId: group.id,
        userId: user.id
    }})

    if(isMember) {
       return res.status(400).json({ error: 'User is already member '})
    }

    // todo only owner can make changes
    await Membership.create(({
        groupId: group.id,
        userId: user.id,
        pending: true
    }))

    const updatedGroup = await Group.findByPk(group.id, {
        include: {
            model: User, as: 'users',
            attributes: ['name', 'username', 'id']
        }
    })

    return res.status(201).json(updatedGroup?.users || [])
})

groupRouter.delete('/:gid/members/:uid', auth, userExtractor, async (req, res) => {
    const groupId = req.params.gid
    const userId = req.params.uid

    const group = await Group.findByPk(groupId, { attributes: ['id'] })
    const user = await User.findByPk(userId, { attributes: ['id'] })

    if(!group || !user) {
        return res.status(400).end()
    }

    const accessToGroup = await isGroupOwner(group.id, req.savedUser.id)

    if(!accessToGroup) {
        return res.status(403).end()
    }

    await Membership.destroy({
        where: {
            groupId: groupId,
            userId: userId
        }
    })

    const updatedGroup = await Group.findByPk(group.id, {
        include: {
            model: User, as: 'users',
            attributes: ['name', 'username', 'id']
        }
    })

    return res.status(200).json(updatedGroup?.users || [])
})

groupRouter.get('/:id/messages', auth, userExtractor, async (req, res) => {
    const group = await Group.findByPk(req.params.id, { attributes: ['id'] })

    if(!group) {
        return res.status(400).end()
    }

    const accessToGroup = await isGroupMember(group.id, req.savedUser.id)

    if(!accessToGroup) {
        return res.status(403).json()
    }

    const messages = await Message.findAll({
        where: {
            groupId: group.id
        },
        attributes: {
            exclude: ['userId']
        },
        include: {
            model: User,
            attributes: ['name', 'username', 'id']
        }
    })

    return res.status(200).json(messages)
})

groupRouter.put('/:id', auth, userExtractor, async (req, res) => {
    const body = req.body
    const groupId = req.params.id
    const group = await Group.findByPk(groupId)

    if(!body?.name || !group || !body.name === '') {
        return res.status(400).end()
    }

    const accessToGroup = await isGroupOwner(group.id, req.savedUser.id)

    if(!accessToGroup) {
        return res.status(403).end()
    }

    group.name = body.name

    if(body.color) {
        group.color = body.color
    }

    await group.save()

    const groupToSend = await getGroupResponse(group.id, req.savedUser.id)
    return res.status(200).json(groupToSend)
})

groupRouter.delete('/:id/leave', auth, userExtractor, async (req, res) => {
    const groupId = req.params.id
    const group = await Group.findByPk(groupId)

    if(!group) {
        return res.status(404).end()
    }

    const isOwner = await isGroupOwner(group.id, req.savedUser.id)

    if(isOwner) {
        return res.status(403).json({ error: 'Owner cannot leave group' })
    }

    await Membership.destroy({
        where: {
            groupId: group.id,
            userId: req.savedUser.id
        }
    })

    return res.status(200).end()
})

groupRouter.delete('/:id', auth, userExtractor, async (req, res) => {
    const groupId = req.params.id
    const group = await Group.findByPk(groupId)
    const accessToGroup = await isGroupOwner(group.id, req.savedUser.id)

    if(!group || !accessToGroup) {
        return res.status(403).end()
    }

    await Todo.destroy({
        where: {
            groupId: groupId
        }
    })

    await Membership.destroy({
        where: {
            groupId: groupId
        }
    })

    await group.destroy()

    return res.status(200).end()
})

module.exports = groupRouter