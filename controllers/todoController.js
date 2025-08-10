const Todo = require('../models/Todo'); // Import Todo model
const User = require('../models/User'); // Import User model

// Get all todos for a user
exports.getAllTodos = async (req, res) => {
  try {
    const { userId } = req.query; // Get userId from query
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const todos = await Todo.find({ userId }).sort({ created_at: -1 }); // Sort by newest first
    
    res.json({
      success: true,
      message: "Todos retrieved successfully",
      data: todos
    });
  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving todos'
    });
  }
};

// Create a new todo
exports.createTodo = async (req, res) => {
  try {
    const { task } = req.body; // Get task from body
    const { userId } = req.query; // Get userId from query

    if (!task || !task.trim()) {
      return res.status(400).json({
        success: false,
        message: "Task is required"
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Create new todo
    const todo = new Todo({
      task: task.trim(),
      userId: userId,
    });
    
    await todo.save(); // Save todo
    
    res.status(201).json({
      success: true,
      message: "Todo created successfully",
      data: todo
    });
  } catch (error) {
    console.error('Create todo error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating todo'
    });
  }
};

// Update a todo
exports.updateTodo = async (req, res) => {
  try {
    const { id } = req.params; // Get id from params
    const { task, completed, completed_time } = req.body; // Get task, completed, completed_time from body

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Todo ID is required"
      });
    }

    const updateData = {};
    if (task !== undefined) updateData.task = task.trim();
    if (completed !== undefined) updateData.completed = completed;
    if (completed_time !== undefined) updateData.completed_time = completed_time;
    updateData.updated_at = new Date();

    const todo = await Todo.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found"
      });
    }

    res.json({
      success: true,
      message: "Todo updated successfully",
      data: todo
    });
  } catch (error) {
    console.error('Update todo error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating todo'
    });
  }
};

// Delete a todo
exports.deleteTodo = async (req, res) => {
  try {
    const { id } = req.params; // Get id from params

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Todo ID is required"
      });
    }

    const todo = await Todo.findByIdAndDelete(id);
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found"
      });
    }

    res.json({
      success: true,
      message: 'Todo deleted successfully',
      data: { deletedId: id }
    });
  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting todo'
    });
  }
};

// Delete all todos for a user
exports.deleteAllTodos = async (req, res) => {
    try {
        const { userId } = req.query; // Get userId from query

        if (!userId) {
          return res.status(400).json({
            success: false,
            message: "User ID is required"
          });
        }

        // Verify user exists
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({
            success: false,
            message: "User not found"
          });
        }

        const result = await Todo.deleteMany({ userId });
        
        res.json({
          success: true,
          message: 'All todos deleted successfully',
          data: { deletedCount: result.deletedCount }
        });
    } catch (error) {
        console.error('Delete all todos error:', error);
        res.status(500).json({
          success: false,
          message: 'Server error while deleting todos'
        });
    }
};
