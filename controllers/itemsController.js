const TodoItem = require("../model/TodoItem");

exports.postTodoItem = async (req, res, next) => {
 try {
  const userId = req.user.id;
  console.log("Creating todo for user:", userId);
  console.log("Request body:", req.body);
  
  if (!req.body.task || !req.body.date) {
    return res.status(400).json({
      message: "Task and date are required",
      success: false
    });
  }

  const todoItem = new TodoItem({
    ...req.body,
    userid: userId
  });
  
  const item = await todoItem.save();
  res.status(201).json({
    success: true,
    message: "Todo item created successfully",
    ...item.toObject()
  });
 } catch (err) {
  console.error("Error creating todo:", err);
  res.status(500).json({
    message: err.message || "Failed to create todo item",
    success: false
  });
 }
}

exports.getTodoItems = async (req, res, next) => {
  try {
    console.log("Fetching items for user:", req.user.id);
    const todos = await TodoItem.find({ userid: req.user.id }) // Fetch items for the authenticated user;
    console.log("Fetched todos:", todos);
    res.json({todos, success: true});
  } catch (err) {
   res.status(500).json({message: err, success: false});
  }
}

exports.deleteTodoItem = async (req, res, next) => {
  try {
    const id = req.params.id;
    const items = await TodoItem.find({ _id: id }); // Ensure the item belongs to the authenticated user
    if(!items || items.length === 0) {
      return res.status(404).json({message: "Item not found", success: false});
    }
    if(items[0].userid.toString() !== req.user.id) {
      return res.status(403).json({message: "You are not authorized to delete this item", success: false});
    }
    const deletedItem = await TodoItem.findByIdAndDelete(id);
    res.json({deletedItem, success: true});
  } catch (err) {
   res.status(500).json({message: err, success: false});
  }
}

exports.updateTodoItem = async (req, res, next) => {
  try {
    const id = req.params.id;
    const items = await TodoItem.find({ _id: id }); // Ensure the item belongs to the authenticated user
    if(!items || items.length === 0) {
      return res.status(404).json({message: "Item not found", success: false}); 
    }
    if(items[0].userid.toString() !== req.user.id) {
      return res.status(403).json({message: "You are not authorized to update this item", success: false});
    }
  
    const updatedItem = await TodoItem.findByIdAndUpdate(id, req.body, {new: true});
    res.json({updatedItem, success: true});
  } catch (err) {
    res.status(500).json({message: err, success: false});
  }
}