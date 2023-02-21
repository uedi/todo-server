const contactRouter = require('express').Router()
const auth = require('../utils/auth')
const { Contact, User } = require('../models')
const { userExtractor } = require('../utils/middleware')

contactRouter.get('/', auth, userExtractor, async (req, res) => {
    const contacts = await Contact.findAll({
        where: {
            userId: req.savedUser.id
        },
        attributes: {
            exclude: ['userId', 'user_id']
        }
    })
    return res.status(200).json(contacts)
})

contactRouter.post('/', auth, userExtractor, async (req, res) => {
    const body = req.body

    if(!(body?.username || body?.id)) {
        return res.status(400).end()
    }

    let contactUser = null

    if(body.username) {
        contactUser = await User.findOne({
            where: {
                username: body.username
            }
        })
    } else if(body.id) {
        contactUser = await User.findByPk(body.id)
    }

    if(!contactUser) {
        return res.status(400).json({ error: 'Unknown user' })
    }

    const alreadyContact = await Contact.findOne({
        where: {
            userId: req.savedUser.id,
            contactId: contactUser.id
        }
    })

    if(alreadyContact) {
        return res.status(400).json({ error: 'Already contact' })
    }

    const contactToSave = {
        userId: req.savedUser.id,
        contactId: contactUser.id,
        name: contactUser.name
    }

    if(body.color) {
        contactToSave.color = body.color
    }

    const contact = await Contact.create(contactToSave)

    return res.status(201).json(contact)
})

contactRouter.delete('/:id', auth, userExtractor, async (req, res) => {
    const contactId = req.params.id
    console.log(contactId)

    await Contact.destroy({
        where: {
            userId: req.savedUser.id,
            contactId: contactId
        }
    })

    return res.status(200).end()
})

module.exports = contactRouter