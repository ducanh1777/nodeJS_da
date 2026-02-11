const Course = require("../models/Course");

class SiteController {
  // GET /
  index(req, res, next) {
    Course.find({})
      .lean()
      .then((courses) => res.render("home", { courses }))
      .catch(next);
  }

  // [GET] /search
  search(req, res, next) {
    const { q } = req.query;
    if (q) {
      Course.find({ name: { $regex: q, $options: 'i' } })
        .lean()
        .then(courses => {
          res.render("search", { courses, q });
        })
        .catch(next);
    } else {
      res.render("search");
    }
  }
}

module.exports = new SiteController();
