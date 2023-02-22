const bcrypt = require('bcrypt')
const signupRouter = require('express').Router()
const { userWithTokenResponse } = require('./helpers')
const { User } = require('../models')

signupRouter.post('/', async (req, res) => {
    const body = req.body

    if(!body.username || !body.password || !body.name) {
        return res.status(400).json({ error: 'Missing username, password or name' })
    }

    const usernameReserved = await User.findOne({
        where: {
            username: body.username
        }
    })

    if(usernameReserved) {
        return res.status(400).json({ error: 'Username is reserved' })
    }

    const saltrounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltrounds)

    const user = await User.create({ ...req.body, passwordHash })
    const userWithToken = userWithTokenResponse(user)

    return res.status(201).json(userWithToken)
})

module.exports = signupRouter