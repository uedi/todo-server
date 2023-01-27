const listRouter = require('express').Router()
const auth = require('../utils/auth')
const { List, Todo } = require('../models')
const { userExtractor } = require('../utils/middleware')

listRouter.get('/', auth, userExtractor, async (req, res) => {
    const ownedLists = await List.findAll({ owner: req.savedUser.id,
        include: {
            model: Todo
        }
    })
    return res.status(200).json(ownedLists)
})

listRouter.post('/', auth, userExtractor, async (req, res) => {
    const body = req.body

    if(!body?.name) {
        return res.status(400).end()
    }

    const newList = await List.create({
        name: body.name,
        userId: body.groupId ? null : req.savedUser.id,
        groupId: body.groupId
    })

    return res.status(201).json(newList)
})

module.exports = listRouter