const groupRouter = require('express').Router()
const auth = require('../utils/auth')
const { Group, Membership, User } = require('../models')
const { userExtractor } = require('../utils/middleware')

groupRouter.get('/', auth, userExtractor, async (req, res) => {
    const user = await User.findByPk(req.savedUser.id, {
        include: {
            model: Group, as: 'groups',
            include: {
                model: User, as: 'users',
                attributes: ['name', 'username', 'id']
            }
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

    return res.status(201).json(newGroup)
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

module.exports = groupRouter