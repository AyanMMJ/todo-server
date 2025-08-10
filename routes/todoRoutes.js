const express = require('express');
const router = express.Router(); // create router
const todoController = require('../controllers/todoController'); // import todo controller
const auth = require("../middleware/auth"); // auth middleware

router.get('/', auth, todoController.getAllTodos);
router.post('/', auth, todoController.createTodo);
// Place more specific routes before parameterized ones to avoid conflicts
router.delete('/delete/all', auth, todoController.deleteAllTodos);
router.put('/:id', auth, todoController.updateTodo);
router.delete('/:id', auth, todoController.deleteTodo);

module.exports = router;
