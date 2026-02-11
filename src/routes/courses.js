const express = require("express");
const router = express.Router();

const courseController = require("../app/controllers/CourseController");
const requireAuth = require('../app/middlewares/RequireAuthMiddleware');
const checkRole = require('../app/middlewares/CheckRoleMiddleware');

router.get("/create", requireAuth, checkRole, courseController.create);
router.post("/store", requireAuth, checkRole, courseController.store);
router.get("/:id/edit", requireAuth, checkRole, courseController.edit);
router.put("/:id", requireAuth, checkRole, courseController.update);
router.patch("/:id/restore", requireAuth, checkRole, courseController.restore);
router.delete("/:id", requireAuth, checkRole, courseController.destroy);
router.delete("/:id/force", requireAuth, checkRole, courseController.forceDestroy);
router.post("/:id/enroll", requireAuth, courseController.enroll);
router.get("/:slug", courseController.show);
module.exports = router;
