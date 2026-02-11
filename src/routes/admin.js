const express = require('express');
const router = express.Router();

const adminController = require('../app/controllers/AdminController');
const requireAuth = require('../app/middlewares/RequireAuthMiddleware');
const checkRole = require('../app/middlewares/CheckRoleMiddleware');

router.use(requireAuth, checkRole);

router.get('/stored/users', adminController.storedUsers);
router.patch('/users/:id/toggle-block', adminController.toggleBlock);

module.exports = router;
