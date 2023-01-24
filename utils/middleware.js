const tokenExtractor = (req, res, next) => {
    const auth = req.get('Authorization')

    if(auth && auth.toLowerCase().startsWith('bearer')) {
        req.token = auth.substring(7)
    } else {
        req.token = null
    }

    next()
}

module.exports = {
    tokenExtractor
}