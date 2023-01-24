const groupRouter = require('express').Router()
const auth = require('../utils/auth')
const { User, Group } = require('../models')

groupRouter.get('/', auth, async (req, res) => {
    const user = await User.findByPk(req.user.id)

    if(!user) {
        return res.status(401).end()
    }

    const groups = await Group.findAll({ owner: user.id })
    
    return res.status(200).json(groups)
})

module.exports = groupRouter