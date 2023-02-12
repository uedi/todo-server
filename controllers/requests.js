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

module.exports = requestsRouter