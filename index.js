const express = require('express');
const cors = require('cors'); // import cors for cross-origin resource sharing
const bodyParser = require('body-parser'); // import body-parser for parsing request bodies
const mongoose = require('mongoose'); // import mongoose for interacting with MongoDB
const todoRoutes = require('./routes/todoRoutes'); // import todo routes
const userRoutes = require('./routes/userRoutes'); // import user routes
require('dotenv').config(); // Load environment variables

const app = express(); // create express app
// Use port 5000 for local dev to match client; honor PORT only in production
const isProduction = process.env.NODE_ENV === 'production';
const port = isProduction ? (process.env.PORT || 5000) : 5000; // port to listen on

app.use(cors()); // use cors
app.use(express.json()); // use express.json to parse json bodies
app.use(bodyParser.json()); // use body-parser to parse json bodies

// MongoDB connection string for local Compass
// Support both MONGODB_URI and legacy MONGO_DB_URL from README/envs
const MONGODB_URI = process.env.MONGODB_URI 
  || process.env.MONGO_DB_URL 
  || 'mongodb://localhost:27017/todo-app';

// Connect to MongoDB (Local Compass)
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB Compass (Local)');
  console.log(`📍 Database: ${MONGODB_URI}`);
})
.catch((error) => {
  console.error('❌ Failed to connect to MongoDB:', error.message);
  console.log('💡 Make sure MongoDB Compass is running on localhost:27017');
  process.exit(1);
});

// Handle MongoDB connection events
mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed through app termination');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during shutdown:', err);
    process.exit(1);
  }
});

app.use('/api/todos', todoRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Todo App Server is running',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server listening at http://localhost:${port}`);
  console.log(`📊 Health check: http://localhost:${port}/health`);
});
