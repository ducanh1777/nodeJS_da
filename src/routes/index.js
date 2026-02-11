const newsRouter = require("./news");
const meRouter = require("./me");
const coursesRouter = require("./courses");
const siteRouter = require("./site");
const authRouter = require("./auth");
const adminRouter = require("./admin");

function route(app) {
  app.use("/admin", adminRouter);
  app.use("/news", newsRouter);
  app.use("/me", meRouter);
  app.use("/courses", coursesRouter);

  app.use("/", siteRouter);
  app.use("/auth", authRouter);
}
module.exports = route;
