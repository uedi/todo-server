const bcrypt = require('bcrypt')
const accountRouter = require('express').Router()
const auth = require('../utils/auth')
const { userExtractor } = require('../utils/middleware')
const { Contact } = require('../models')
const { userWithTokenResponse } = require('./helpers')

accountRouter.put('/password', auth, userExtractor, async (req, res) => {
    const body = req.body

    if(!body.password || !body.newpassword || body?.newpassword === '') {
        return res.status(400).end()
    } else if(body.password === body.newpassword) {
        return res.status(200).end()
    }

    const passwordCorrect = await bcrypt.compare(body.password, req.savedUser.passwordHash)

    if(!passwordCorrect) {
        return res.status(401).json({ error: 'Invalid credentials' })
    }

    const saltrounds = 10
    const newPasswordHash = await bcrypt.hash(body.newpassword, saltrounds)

    req.savedUser.passwordHash = newPasswordHash
    await req.savedUser.save()

    return res.status(200).end()
})

accountRouter.put('/name', auth, userExtractor, async (req, res) => {
    const body = req.body

    if(!body.name || !body.name === '') {
        return res.status(400).end()
    }

    req.savedUser.name = body.name
    const savedUser = await req.savedUser.save()

    await Contact.update({ name: body.name },
        {
            where: {
                contactId: req.savedUser.id
            }
        }
    )

    const userWithToken = userWithTokenResponse(savedUser)

    return res.status(200).json(userWithToken)
})

module.exports = accountRouter