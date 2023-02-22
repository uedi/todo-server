const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const { userWithTokenResponse } = require('./helpers')
const { User } = require('../models')

loginRouter.post('/', async (req, res) => {
    const body = req.body

    if(!body.username || !body.password) {
        return res.status(400).json({ error: 'Missing username and/or password' })
    }

    const user = await User.findOne({
        where: {
            username: body.username
        }
    })

    const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(body.password, user.passwordHash)

    if(!passwordCorrect) {
        return res.status(401).json({ error: 'Invalid credentials' })
    }

    const userWithToken = userWithTokenResponse(user)

    return res.status(200).json(userWithToken)
})

module.exports = loginRouter