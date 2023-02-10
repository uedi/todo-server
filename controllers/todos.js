const todoRouter = require('express').Router()
const auth = require('../utils/auth')
const { Todo, List } = require('../models')
const { userExtractor } = require('../utils/middleware')
const { isGroupMember, hasListAccess } = require('./helpers')

todoRouter.post('/', auth, userExtractor, async (req, res) => {
    const body = req.body

    if(!body?.name || !(body.listId || body.groupId)) {
        return res.status(400).end()
    }

    const accessToList = await hasListAccess(body.listId, req.savedUser.id)
    const accessToGroup = await isGroupMember(body.groupId, req.savedUser.id)

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

    const accessToGroup = await isGroupMember(todoToUpdate.groupId, req.savedUser.id)
    const accessToList = await hasListAccess(todoToUpdate.listId, req.savedUser.id)

    if(!accessToGroup && !accessToList) {
        return res.status(400).end()
    }

    todoToUpdate.done = body.done
    todoToUpdate.name = body.name || todoToUpdate.name
    todoToUpdate.start = body.start || todoToUpdate.start
    todoToUpdate.end = body.end || todoToUpdate.end

    await todoToUpdate.save()
    const savedTodo = await Todo.findByPk(body.id)
    return res.status(200).json(savedTodo)
})

todoRouter.delete('/:id', auth, userExtractor, async (req, res) => {
    const id = req.params?.id

    if(!id) {
        return res.status(400).end()
    }

    const todo = await Todo.findByPk(id)

    if(!todo) {
        return res.status(404).end()
    }

    const accessToGroup = await isGroupMember(todo.groupId, req.savedUser.id)
    const accessToList = await hasListAccess(todo.listId, req.savedUser.id)

    if(!accessToGroup && !accessToList) {
        return res.status(400).end()
    }

    await todo.destroy()

    return res.status(200).end()
})

module.exports = todoRouter