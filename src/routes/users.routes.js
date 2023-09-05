const { Router } = require("express");
const UserController = require("../controller/userController");

const userRoutes = Router();

function myMiddleware(request, response, next){
  console.log("você passou");

  next();
}


const userController = new UserController();

userRoutes.post("/", myMiddleware,userController.create);
userRoutes.put("/:id", myMiddleware,userController.update);

module.exports = userRoutes;