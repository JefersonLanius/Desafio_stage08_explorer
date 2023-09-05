require("express-async-errors");

const database = require("./database/sqlite");

const AppError = require("./utils/AppError");
const express = require("express");

const routes = require("./routes");
const { error } = require("console");
const { request } = require("http");
const app = express();
app.use(express.json());

app.use(routes);

database();

app.use((error, request, response, next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
  }

  console.error(error);

  return response.status(500).json({
    status: "error",
    message: "Internar server error",
  });
});

const port = 3333;
app.listen(port, () => console.log(`Server is runing on port ${port}`));
