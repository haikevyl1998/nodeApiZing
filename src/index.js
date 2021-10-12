const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const routes = require("./routes");
const configs = require("./configs");

const app = express();
app.use(express.static("public"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", routes);

app.use((req, res, next) => {
  const error = new Error("Not Found!");
  error.status = 404;
  return next(error);
});

app.use((error, req, res, next) => {
  const er = configs.env === "development" ? error : {};
  const status = er.status || 500;

  return res.status(status).json({
    success: false,
    error: error.message,
  });
});

const port = configs.port || 3000;
app.listen(port, () => {
  console.log(`Home page: http://localhost:${port}`);
});
