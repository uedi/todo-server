require('dotenv').config()

const PORT = process.env.PORT || 3000
const DATABASE_URL = process.env.DATABASE_URL
const DATABASE_SSL = process.env.NO_DATABASE_SSL ? false : true

module.exports = {
    PORT, DATABASE_URL
}