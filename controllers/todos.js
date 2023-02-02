const todoRouter = require('express').Router()
const auth = require('../utils/auth')
const { Todo, List, Membership } = require('../models')
const { userExtractor } = require('../utils/middleware')

todoRouter.post('/', auth, userExtractor, async (req, res) => {
    const body = req.body

    if(!body?.name || !(body.listId || body.groupId)) {
        return res.status(400).end()
    }

    const accessToList = (await List.findByPk(body.listId))?.userId === req.savedUser.id
    const accessToGroup = await Membership.findOne({
        where: {
            groupId: body.groupId,
            userId: req.savedUser.id
        }
    })

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

todoRouter.put('/', auth, userExtractor, async (req, res) => {
    const body = req.body

    if(!body.id) {
        return res.status(400).end()
    }

    const todoToUpdate = await Todo.findByPk(body.id)

    if(!todoToUpdate) {
        return res.status(400).end()
    }

    // todo check access

    todoToUpdate.done = body.done

    await todoToUpdate.save()
    const savedTodo = await Todo.findByPk(body.id)
    return res.status(200).json(savedTodo)
})

module.exports = todoRouter