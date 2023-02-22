const express = require('express')
require('express-async-errors')
const app = express()
const middleware = require('./utils/middleware')
const signupRouter = require('./controllers/signup')
const loginRouter = require('./controllers/login')
const groupsRouter = require('./controllers/groups')
const listsRouter = require('./controllers/lists')
const todoRouter = require('./controllers/todos')
const contactsRouter = require('./controllers/contacts')
const messagesRouter = require('./controllers/messages')
const requestsRouter = require('./controllers/requests')
const accountRouter = require('./controllers/account')

app.use(express.json())

app.use('/api/signup', signupRouter)
app.use('/api/login', loginRouter)

app.use(middleware.tokenExtractor)

app.use('/api/groups', groupsRouter)
app.use('/api/lists', listsRouter)
app.use('/api/todos', todoRouter)
app.use('/api/contacts', contactsRouter)
app.use('/api/messages', messagesRouter)
app.use('/api/requests', requestsRouter)
app.use('/api/account', accountRouter)

app.use(middleware.errorHandler)

app.get('/', (req, res) => {
    res.send('/')
})

module.exports = app