const mongoose = require('mongoose');
const User = require('./User');

const todoSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completed_time: {
    type: Date,
    default: null,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
  collection: 'todos' // Explicitly name the collection as 'todos'
});

// Update the updated_at field whenever the document is modified
todoSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
