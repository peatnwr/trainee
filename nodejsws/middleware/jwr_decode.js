const jwt = require('jsonwebtoken');
var { Response } = require('../config/response');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split("Bearer ")[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.auth = decoded;
        req.name = decoded.name;
        req.position = decoded.position ? "admin" : "user";
        return next();
    } catch (err) {
        return res.status(401).send(Response(401, "Authorization failed", err));
    }
}