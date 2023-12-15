require('dotenv').config()
const jwt = require('jsonwebtoken')


const isAdmin = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).send('unauthorized request')
    }
    const token = req.headers['authorization'].split(' ')[1]
    if (!token) {
        return res.status(403).send("Invalid Token")
    }
    try {
        const decoded = jwt.verify(token,`${process.env.SECRET_KEY}`)
        req.user = decoded
        if (req.user.roles !== 'ROLE_ADMIN') {
            return res.status(403).json({ message: 'Forbidden - Admin access required' });
        }
        next();
    } catch (error) {
        console.log(error)
        res.status(400).send('Bad Request')
    }
}
module.exports = isAdmin