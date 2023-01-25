const express = require('express')
const app = express()
const middleware = require('./utils/middleware')
const signupRouter = require('./controllers/signup')
const loginRouter = require('./controllers/login')
const groupsRouter = require('./controllers/groups')
const listsRouter = require('./controllers/lists')

app.use(express.json())

app.use('/api/signup', signupRouter)
app.use('/api/login', loginRouter)

app.use(middleware.tokenExtractor)

app.use('/api/groups', groupsRouter)
app.use('/api/lists', listsRouter)

app.get('/', (req, res) => {
    res.send('/')
})

module.exports = app