const Course = require("../models/Course");

class CourseController {


  // [GET] /courses/create
  create(req, res, next) {
    res.render("courses/create");
  }

  // [POST] /courses/store
  store(req, res, next) {
    req.body.image = `https://img.youtube.com/vi/${req.body.videoID}/sddefault.jpg`;
    req.body.user_id = req.user._id;
    const course = new Course(req.body);
    course
      .save()
      .then(() => res.redirect("/me/stored/courses"))
      .catch(next);
  }

  // [GET] /courses/:id/edit
  edit(req, res, next) {
    Course.findById(req.params.id)
      .lean()
      .then((course) => res.render("courses/edit", { course }))
      .catch(next);
  }

  // [PUT] /courses/:id
  update(req, res, next) {
    Course.updateOne({ _id: req.params.id }, req.body)
      .lean()
      .then(() => res.redirect("/me/stored/courses"))
      .catch(next);
  }

  // [DELETE] /courses/:id
  destroy(req, res, next) {
    Course.delete({ _id: req.params.id })
      .lean()
      .then(() => res.redirect("/me/stored/courses"))
      .catch(next);
  }

  // [DELETE] /courses/:id
  forceDestroy(req, res, next) {
    Course.deleteOne({ _id: req.params.id })
      .lean()
      .then(() => res.redirect("/me/stored/courses"))
      .catch(next);
  }

  // [PATCH] /courses/:id/restore
  restore(req, res, next) {
    Course.restore({ _id: req.params.id })
      .lean()
      .then(() => res.redirect("/me/stored/courses"))
      .catch(next);
  }

  // [POST] /courses/:id/enroll
  async enroll(req, res, next) {
    if (!req.user) return res.redirect('/auth/login');
    try {
      const course = await Course.findById(req.params.id);
      if (!course) return res.status(404).send('Course not found');

      // Logic giả lập thanh toán
      // Nếu course.price > 0 -> Redirect payment (skip for now)

      const User = require('../models/User');
      await User.updateOne({ _id: req.user._id }, {
        $addToSet: { enrolled_courses: course._id }
      });

      res.redirect(`/courses/${course.slug}`);
    } catch (err) {
      next(err);
    }
  }

  // [GET] /courses/:slug
  async show(req, res, next) {
    try {
      const course = await Course.findOne({ slug: req.params.slug }).lean();
      if (!course) return res.status(404).send('Course not found');

      let isEnrolled = false;
      if (req.user) {
        const User = require('../models/User');
        const user = await User.findById(req.user._id);
        if (user.enrolled_courses.includes(course._id.toString())) {
          isEnrolled = true;
        }
        // Allow admin/creator to view
        if (req.user.role === 'admin' || (course.user_id && course.user_id.toString() === req.user._id.toString())) {
          isEnrolled = true;
        }
      }

      res.render("courses/show", { course, isEnrolled });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CourseController();
