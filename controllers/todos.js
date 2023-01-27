const todoRouter = require('express').Router()
const auth = require('../utils/auth')
const { Todo, List, Group } = require('../models')
const { userExtractor } = require('../utils/middleware')

todoRouter.post('/', auth, userExtractor, async (req, res) => {
    const body = req.body

    if(!body?.name || !(body.listId || body.groupId)) {
        return res.status(400).end()
    }

    const accessToList = (await List.findByPk(body.listId))?.userId === req.savedUser.id
    const accessToGroup = (await Group.findByPk(body.groupId))?.owner === req.savedUser.id

    if(!accessToList && !accessToGroup) {
        return res.status(401).json({ error: 'No access' })
    }

    const newTodo = await Todo.create({
        name: body.name,
        listId: accessToList ? body.listId : null,
        groupId: accessToGroup ? body.groupId : null,
        start: body.start,
        end: body.end
    })

    return res.status(201).json(newTodo)
})

module.exports = todoRouter