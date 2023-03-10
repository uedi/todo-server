const listRouter = require('express').Router()
const auth = require('../utils/auth')
const { List, Todo } = require('../models')
const { userExtractor } = require('../utils/middleware')
const { hasListAccess } = require('./helpers')

listRouter.get('/', auth, userExtractor, async (req, res) => {
    const ownedLists = await List.findAll({
        where: {
            userId: req.savedUser.id
        },
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

    const listToCreate = {
        name: body.name,
        userId: body.groupId ? null : req.savedUser.id,
        groupId: body.groupId
    }

    if(body.color) {
        listToCreate.color = body.color
    }

    const newList = await List.create(listToCreate)

    return res.status(201).json(newList)
})

listRouter.put('/:id', auth, userExtractor, async (req, res) => {
    const body = req.body
    const listId = req.params.id
    const list = await List.findByPk(listId)

    if(!body?.name || !list || !body.name === '') {
        return res.status(400).end()
    }

    const accessToList = await hasListAccess(list.id, req.savedUser.id)

    if(!accessToList) {
        return res.status(403).end()
    }

    list.name = body.name

    if(body.color) {
        list.color = body.color
    }

    await list.save()

    const savedList = await List.findByPk(list.id, {
        include: {
            model: Todo
        }
    })

    return res.status(200).json(savedList)
})

listRouter.delete('/:id', auth, userExtractor, async (req, res) => {
    const listId = req.params.id
    const list = await List.findByPk(listId)
    const accessToList = await hasListAccess(list?.id, req.savedUser.id)

    if(!list || !accessToList) {
        return res.status(400).end()
    }

    await Todo.destroy({
        where: {
            listId: listId
        }
    })

    await list.destroy()

    return res.status(200).end()
})


module.exports = listRouter