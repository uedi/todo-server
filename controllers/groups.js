const groupRouter = require('express').Router()
const auth = require('../utils/auth')
const { Group, Membership, User, Message, Todo } = require('../models')
const { userExtractor } = require('../utils/middleware')
const { isGroupMember, isGroupOwner } = require('./helpers')

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
    return res.status(200).json(user?.groups || [])
})

groupRouter.post('/', auth, userExtractor, async (req, res) => {
    const body = req.body

    if(!body?.name) {
        return res.status(400).end()
    }

    const newGroup = await Group.create({
        name: body.name
    })
    await Membership.create({
        groupId: newGroup.id,
        userId: req.savedUser.id,
        owner: true
    })

    const createdGroup = await Group.findByPk(newGroup.id, {
        include: {
            model: User, as: 'users',
            attributes: ['name', 'username', 'id']
        }
    })

    return res.status(201).json(createdGroup)
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
        userId: user.id
    }))

    const updatedGroup = await Group.findByPk(group.id, {
        include: {
            model: User, as: 'users',
            attributes: ['name', 'username', 'id']
        }
    })

    return res.status(201).json(updatedGroup?.users || [])
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
    await group.save()

    const savedGroup = await Group.findByPk(group.id, {
        include: [{
            model: User, as: 'users',
            attributes: ['name', 'username', 'id']
        }, {
            model: Todo
        }]
    })

    return res.status(200).json(savedGroup)
})

module.exports = groupRouter