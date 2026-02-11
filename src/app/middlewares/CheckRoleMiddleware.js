module.exports = function (req, res, next) {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).send('Access Denied: You do not have permission to perform this action.');
    }
};
