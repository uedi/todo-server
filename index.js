const app = require('./app')
const { PORT } = require('./utils/config')
const { connectToDatabase } = require('./utils/db')

console.log(`Env: ${process.env.NODE_ENV}`)

const main = async () => {
    await connectToDatabase()
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
}

main()