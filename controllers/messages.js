const messageRouter = require('express').Router()
const auth = require('../utils/auth')
const { Message, Group, User } = require('../models')
const { userExtractor } = require('../utils/middleware')
const { isGroupMember } = require('./helpers')

messageRouter.post('/', auth, userExtractor, async (req, res) => {
    const body = req.body

    if(!body?.message || !body?.groupId) {
        return res.status(400).end()
    }

    const group = await Group.findByPk(body.groupId)

    if(!group) {
        return res.status(400).end()
    }

    const accessToGroup = await isGroupMember(group.id, req.savedUser.id)

    if(!accessToGroup) {
        return res.status(403).end()
    }

    const message = await Message.create({
        message: body.message,
        userId: req.savedUser.id,
        groupId: group.id
    })

    const createdMessage = await Message.findByPk(message.id, {
        attributes: {
            exclude: ['userId']
        },
        include: {
            model: User,
            attributes: ['name', 'username', 'id']
        }
    })

    return res.status(201).json(createdMessage)
})

messageRouter.delete('/:id', auth, userExtractor, async (req, res) => {
    const id = req.params?.id

    if(!id) {
        return res.status(400).end()
    }

    const message = await Message.findByPk(id)

    if(!message) {
        return res.status(404).end()
    } else if(message.userId !== req.savedUser.id) {
        return res.status(403).end()
    }

    await message.destroy()

    return res.status(200).end()
})

module.exports = messageRouter