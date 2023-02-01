const groupRouter = require('express').Router()
const auth = require('../utils/auth')
const { Group, Membership, User } = require('../models')
const { userExtractor } = require('../utils/middleware')

groupRouter.get('/', auth, userExtractor, async (req, res) => {
    const groups = await Group.findAll({
        where: {
            owner: req.savedUser.id
        },
        include: ['todos', 'users']
    })

    return res.status(200).json(groups)
})

groupRouter.post('/', auth, userExtractor, async (req, res) => {
    const body = req.body

    if(!body?.name) {
        return res.status(400).end()
    }

    const newGroup = await Group.create({
        name: body.name,
        owner: req.savedUser.id
    })

    return res.status(201).json(newGroup)
})

groupRouter.post('/:id/members', auth, userExtractor, async (req, res) => {
    const body = req.body

    if(!body?.contactId) {
        return res.status(400).end()
    }

    const group = await Group.findByPk(req.params.id)
    const user = await User.findByPk(body.contactId)

    if(!group || !user) {
        return res.status(400).end()
    }

    // todo check access

    await Membership.create(({
        groupId: group.id,
        userId: user.id
    }))

    // todo return users

    return res.status(201).end()
})

module.exports = groupRouter