const path = require("path");
const express = require("express");
const morgan = require("morgan");
const methodOverride = require("method-override");
const handlebars = require("express-handlebars").engine;
const app = express();
const port = 3000;
const sass = require("sass");
const fs = require("fs");
const cookieParser = require('cookie-parser');
const authMiddleware = require('./app/middlewares/AuthMiddleware');
const sortMiddleware = require('./app/middlewares/SortMiddleware');

const route = require("./routes");
const db = require("./config/db");

db.connect();

// đường dẫn file
const scssPath = path.join(__dirname, "resources/scss/app.scss");
const cssPath = path.join(__dirname, "public/css/app.css");

// compile scss -> css
const result = sass.compile(scssPath);

// ghi ra file css
fs.writeFileSync(cssPath, result.css);

app.use(express.static(path.join(__dirname, "public")));

app.use(morgan("combined"));

app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(express.json());
app.use(methodOverride("_method"));

app.use(cookieParser());
app.use(authMiddleware);
app.use(sortMiddleware);

app.engine(
  "hbs",
  handlebars({
    extname: ".hbs",
    helpers: require('./app/helpers/handlebars'),
  }),
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources", "views"));

//Routes init
route(app);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
