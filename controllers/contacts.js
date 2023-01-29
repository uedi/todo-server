const contactRouter = require('express').Router()
const auth = require('../utils/auth')
const { Contact, User } = require('../models')
const { userExtractor } = require('../utils/middleware')

contactRouter.get('/', auth, userExtractor, async (req, res) => {
    const contacts = await Contact.findAll({ user_id: req.savedUser.id})
    return res.status(200).json(contacts)
})

contactRouter.post('/', auth, userExtractor, async (req, res) => {
    const body = req.body

    if(!body?.username) {
        return res.status(400).end()
    }

    const contactUser = await User.findOne({
        where: {
            username: body.username
        }
    })

    if(!contactUser) {
        const error = {
            message: 'Unknown username'
        }
        return res.status(400).json({ error })
    }

    const contact = await Contact.create({
        userId: req.savedUser.id,
        contactId: contactUser.id,
        name: contactUser.name
    })

    return res.status(201).json(contact)
})

module.exports = contactRouter