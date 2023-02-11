const bcrypt = require('bcrypt')
const signupRouter = require('express').Router()
const jwt = require('jsonwebtoken')

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
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.TOKEN_DATA)

    return res.status(201).json({
        token,
        user: {
            id: user.id,
            username: user.username,
            name: user.name
        }
    })
})

module.exports = signupRouter