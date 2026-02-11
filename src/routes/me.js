const express = require('express');
const router = express.Router();

const meController = require('../app/controllers/MeController');
const requireAuth = require('../app/middlewares/RequireAuthMiddleware');

router.use(requireAuth);

router.get('/learning', meController.learning);
router.get('/stored/courses', meController.storedCourses);
router.get('/trash/courses', meController.trashCourses);

router.get('/stored/news', meController.storedNews);
router.get('/trash/news', meController.trashNews);

module.exports = router;
