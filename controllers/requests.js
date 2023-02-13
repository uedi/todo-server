const requestsRouter = require('express').Router()
const auth = require('../utils/auth')
const { Membership, User, Group } = require('../models')
const { userExtractor } = require('../utils/middleware')

requestsRouter.get('/', auth, userExtractor, async (req, res) => {
    const memberships = await Membership.findAll({
        where: {
            userId: req.savedUser.id,
            pending: true
        },
        include: {
            model: Group,
            attributes: ['name', 'id']
        }
    })

    const dataToSend = {
        memberships: memberships
    }

    return res.status(200).json(dataToSend)
})

requestsRouter.post('/membership', auth, userExtractor, async (req, res) => {
    const body = req.body

    if(!body?.groupId) {
        return res.status(400).end()
    }

    const membership = await Membership.findOne({
        where: {
            groupId: body.groupId,
            userId: req.savedUser.id
        }
    })

    if(!membership) {
        return res.status(404).end()
    }

    if(!membership.pending) {
        console.log('membership is not pending')
    }

    if(body.reject) {
        await membership.destroy()
    } else {
        membership.pending = false
        await membership.save()
    }

    const memberships = await Membership.findAll({
        where: {
            userId: req.savedUser.id,
            pending: true
        },
        include: {
            model: Group,
            attributes: ['name', 'id']
        }
    })

    const group = await Group.findByPk(body.groupId, {
        include: {
            model: User, as: 'users',
            attributes: ['name', 'username', 'id']
        }
    })

    return res.status(200).json({ memberships: memberships, group: group })
})

module.exports = requestsRouter