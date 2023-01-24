const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const loginRouter = require('express').Router()

const { User } = require('../models')

loginRouter.post('/', async (req, res) => {
    const body = req.body

    if(!body.username || !body.password) {
        const error = {
            message: 'Missing username and/or password'
        }
        return res.status(400).json({ error })
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
        const error = {
            message: 'Invalid credentials'
        }
        return res.status(401).json({ error })
    }

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.TOKEN_DATA)

    return res.status(200).json({
        token,
        user: {
            id: user.id,
            username: user.username,
            name: user.name
        }
    })
})

module.exports = loginRouter