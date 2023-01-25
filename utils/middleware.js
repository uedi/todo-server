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

module.exports = {
    tokenExtractor, userExtractor
}