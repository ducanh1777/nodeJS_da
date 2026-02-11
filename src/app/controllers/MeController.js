const Course = require("../models/Course");
const News = require("../models/News");

class MeController {
  // [GET] /me/stored/courses
  storedCourses(req, res, next) {
    let courseQuery = Course.find({ user_id: req.user._id });

    if (Object.prototype.hasOwnProperty.call(req.query, '_sort')) {
      courseQuery = courseQuery.sort({
        [req.query.column]: req.query.type,
      });
    }

    courseQuery
      .lean()
      .then((courses) => res.render("me/stored-courses", { courses }))
      .catch(next);
  }

  // [GET] /me/learning
  async learning(req, res, next) {
    try {
      const User = require('../models/User');
      const user = await User.findById(req.user._id).populate('enrolled_courses').lean();
      res.render('me/learning', { courses: user.enrolled_courses });
    } catch (err) {
      next(err);
    }
  }

  // [GET] /me/trash/courses
  trashCourses(req, res, next) {
    Course.findWithDeleted({ deleted: true, user_id: req.user._id })
      .lean()
      .then((courses) => res.render("me/trash-courses", { courses }))
      .catch(next);
  }

  // [GET] /me/stored/news
  storedNews(req, res, next) {
    News.find({ user_id: req.user._id })
      .lean()
      .then(news => res.render('me/stored-news', { news }))
      .catch(next);
  }

  // [GET] /me/trash/news
  trashNews(req, res, next) {
    News.findWithDeleted({ deleted: true, user_id: req.user._id })
      .lean()
      .then(news => res.render('me/trash-news', { news }))
      .catch(next);
  }
}

module.exports = new MeController();
