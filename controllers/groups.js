const groupRouter = require('express').Router()
const auth = require('../utils/auth')
const { Group } = require('../models')
const { userExtractor } = require('../utils/middleware')

groupRouter.get('/', auth, userExtractor, async (req, res) => {
    const groups = await Group.findAll({ owner: req.savedUser.id })
    
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

module.exports = groupRouter