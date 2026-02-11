const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = function (req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        req.user = null;
        res.locals.user = null;
        return next();
    }

    try {
        const decoded = jwt.verify(token, 'MY_SECRET_KEY'); // Should use environment variable
        req.user = decoded;
        res.locals.user = decoded; // Available in views
        next();
    } catch (err) {
        res.clearCookie('token');
        req.user = null;
        res.locals.user = null;
        next();
    }
};
