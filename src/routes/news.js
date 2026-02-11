const express = require('express');
const router = express.Router();

const newsController = require('../app/controllers/NewsController');
const requireAuth = require('../app/middlewares/RequireAuthMiddleware');

// Protected routes (Specific routes MUST come before generic parameter routes)
router.post('/:id/like', requireAuth, newsController.toggleLike);
router.post('/:id/comments', requireAuth, newsController.storeComment);
router.delete('/comments/:id', requireAuth, newsController.destroyComment);
router.put('/comments/:id', requireAuth, newsController.updateComment);
router.post('/comments/:id/like', requireAuth, newsController.toggleLikeComment);

router.get('/create', requireAuth, newsController.create);
router.post('/store', requireAuth, newsController.store);
router.get('/:id/edit', requireAuth, newsController.edit);
router.put('/:id', requireAuth, newsController.update);
router.patch('/:id/restore', requireAuth, newsController.restore);
router.delete('/:id', requireAuth, newsController.destroy);
router.delete('/:id/force', requireAuth, newsController.forceDestroy);

// Public routes
router.get('/:slug', newsController.show);
router.get('/', newsController.index);

module.exports = router;
