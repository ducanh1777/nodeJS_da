const path = require("path");
const express = require("express");
const morgan = require("morgan");
const handlebars = require("express-handlebars").engine;
const app = express();
const port = 3000;
const sass = require("sass");
const fs = require("fs");

// đường dẫn file
const scssPath = path.join(__dirname, "resources/scss/app.scss");
const cssPath = path.join(__dirname, "public/css/app.css");

// compile scss -> css
const result = sass.compile(scssPath);

// ghi ra file css
fs.writeFileSync(cssPath, result.css);

app.use(express.static(path.join(__dirname, "public")));

app.use(morgan("combined"));

app.engine("hbs", handlebars({ extname: ".hbs" }));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources\\views"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/news", (req, res) => {
  res.render("news");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
