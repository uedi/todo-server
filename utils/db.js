const { Sequelize } = require('sequelize')
const { DATABASE_URL, DATABASE_SSL } = require('../utils/config')

const sequelize = new Sequelize(DATABASE_URL, {
    dialectOptions: {
        ssl: DATABASE_SSL ? {
            require: true,
            rejectUnauthorized: false
        } : null
    }
})

const connectToDatabase = async () => {
    try {
        await sequelize.authenticate()
        console.log('Connected to database')
    } catch(error) {
        console.log('Failed to connect to database', error)
        return process.exit(1)
    }
    return null
}

module.exports = {
    connectToDatabase, sequelize
}