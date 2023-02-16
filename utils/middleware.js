const { User } = require('../models')

const tokenExtractor = (req, res, next) => {
    const auth = req.get('Authorization')

    if(auth && auth.toLowerCase().startsWith('bearer')) {
        req.token = auth.substring(7)
    } else {
        req.token = null
    }

    next()
}

const userExtractor = async (req, res, next) => {
    const user = await User.findByPk(req.user.id)
    if(!user) {
        return res.status(401).end()
    }
    req.savedUser = user
    next()
}

const errorHandler = (error, request, response, next) => {
    console.log('errorHandler', error.name, error.message)
    if( error.name === 'SequelizeValidationError' || error.name === 'SequelizeDatabaseError') {
        return response.status(400).send({ error: error.message || 'Malformatted data' })
    } else {
        return response.status(500).json({ error: 'Unknown server error' })
    }
}

module.exports = {
    tokenExtractor, userExtractor, errorHandler
}