const jwt = require('jsonwebtoken')

const auth = (request, response, next) => {
    if(!request.token) {
        return response.status(401).json({ error: 'Token missing'})
    }

    let validToken

    try {
        validToken = jwt.verify(request.token, process.env.TOKEN_DATA)
    } catch(error) {
        return response.status(401).json({ error: 'Invalid token' })
    }

    if(!validToken || !validToken.id) {
        return response.status(401).json({ error: 'Invalid token' })
    }

    request.user = validToken

    next()
}

module.exports = auth