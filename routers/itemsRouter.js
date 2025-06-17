const express = require("express");
const itemsController = require("../controllers/itemsController");
const itemsRouter = express.Router();
const verifyToken = require("../middlewares/verifyToken");

itemsRouter.post("/todos", verifyToken, itemsController.postTodoItem);
itemsRouter.get("/todos", verifyToken, itemsController.getTodoItems);
itemsRouter.delete("/todos/:id", verifyToken, itemsController.deleteTodoItem);
itemsRouter.patch("/todos/:id", verifyToken, itemsController.updateTodoItem);

module.exports = itemsRouter;
