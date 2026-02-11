const User = require('../models/User');

class AdminController {
    // [GET] /admin/stored/users
    storedUsers(req, res, next) {
        User.find({})
            .lean()
            .then(users => {
                res.render('admin/stored-users', {
                    users
                });
            })
            .catch(next);
    }

    // [PATCH] /admin/users/:id/toggle-block
    toggleBlock(req, res, next) {
        const userId = req.params.id;
        const isBlocked = req.body.isBlocked === 'true'; // Convert string to boolean (value from form)

        User.updateOne({ _id: userId }, { isBlocked: isBlocked })
            .then(() => res.redirect('/admin/stored/users'))
            .catch(next);
    }
}

module.exports = new AdminController();
