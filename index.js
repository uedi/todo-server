const app = require('./app')
const { PORT } = require('./utils/config')

console.log(`Env: ${process.env.NODE_ENV}`)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})