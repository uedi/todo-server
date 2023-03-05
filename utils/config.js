require('dotenv').config()

const PORT = process.env.PORT || 3001
const DATABASE_URL = process.env.NODE_ENV === 'test'
    ? process.env.TEST_DATABASE_URL
    : process.env.DATABASE_URL
const DATABASE_SSL = process.env.NO_DATABASE_SSL ? false : true
const SEQUELIZE_LOGGING = process.env.NO_SEQUELIZE_LOGGING ? false : true

module.exports = {
    PORT, DATABASE_URL, DATABASE_SSL, SEQUELIZE_LOGGING
}