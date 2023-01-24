const express = require('express')
const app = express()
const signupRouter = require('./controllers/signup')
const loginRouter = require('./controllers/login')

app.use(express.json())

app.use('/api/signup', signupRouter)
app.use('/api/login', loginRouter)

app.get('/', (req, res) => {
    res.send('/')
})

module.exports = app