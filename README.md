# Todo App - Server

This is the server-side code for the Todo App. It provides the API endpoints and handles database operations for managing todos using **MongoDB Compass** (local MongoDB).

## 🎯 **Architecture Followed**

MVC (Model View Controller) Architecture

The architecture followed is an MVC architecture where models and controllers are in the server whereas views are in our client app.

## 🗄️ **Database Setup (MongoDB Compass)**

### **Prerequisites**
1. **MongoDB Community Server** - Download and install from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. **MongoDB Compass** - Download and install from [MongoDB Compass](https://www.mongodb.com/try/download/compass)

### **Setup Steps**

1. **Install MongoDB Community Server**
   - Download and install MongoDB Community Server
   - Ensure MongoDB service is running on `localhost:27017`

2. **Install MongoDB Compass**
   - Download and install MongoDB Compass (GUI for MongoDB)
   - Open Compass and connect to: `mongodb://localhost:27017`

3. **Create Database**
   - In Compass, click "Create Database"
   - Database Name: `todo-app`
   - Collection Name: `users` (first collection)
   - Click "Create Database"

4. **Create Collections**
   - In the `todo-app` database, create two collections:
     - `users` - for storing user data
     - `todos` - for storing todo items

5. **Environment Variables**
   - Create a `.env` file in the server directory:
   ```env
   # MongoDB Configuration (Local Compass)
   MONGODB_URI=mongodb://localhost:27017/todo-app
   
   # JWT Secret Key (Change this to a secure random string)
   TOKEN_KEY=your-super-secret-jwt-key-change-this-in-production
   
   # Server Configuration
   PORT=8080
   
   # Environment
   NODE_ENV=development
   ```

## 🚀 **Installation and Setup**

1. **Navigate to server directory**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env` (if available)
   - Or create a new `.env` file with the variables above

4. **Start the server**
   ```bash
   npm run dev
   ```

5. **Verify the setup**
   - Server should start on `http://localhost:8080`
   - Health check: `http://localhost:8080/health`
   - MongoDB connection should be successful

## 📊 **Database Collections**

### **Users Collection**
```javascript
{
  _id: ObjectId,
  first_name: String,
  last_name: String,
  email: String (unique, lowercase),
  password: String (hashed),
  picture: String (optional),
  token: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

### **Todos Collection**
```javascript
{
  _id: ObjectId,
  task: String (required, max 500 chars),
  userId: ObjectId (ref: User),
  completed: Boolean (default: false),
  completed_time: Date (optional),
  created_at: Date,
  updated_at: Date
}
```

## 🔌 **API Endpoints**

The server provides the following API endpoints:

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `POST` | `/api/users/register` | Register a new user | ❌ |
| `POST` | `/api/users/login` | Login an existing user | ❌ |
| `GET` | `/api/todos` | Get all todos for logged user | ✅ |
| `POST` | `/api/todos` | Create a new todo | ✅ |
| `PUT` | `/api/todos/:id` | Update a todo | ✅ |
| `DELETE` | `/api/todos/:id` | Delete a todo | ✅ |
| `DELETE` | `/api/todos/delete/all` | Delete all todos | ✅ |
| `GET` | `/health` | Health check | ❌ |

### **Authentication**
All protected endpoints require a JWT token in the header:
```
x-access-token: <your-jwt-token>
```
or
```
Authorization: Bearer <your-jwt-token>
```

## 🛠️ **Technologies Used**

- **Node.js** with Express.js for building the server
- **MongoDB Compass** (Local) for the database
- **Mongoose** for database operations and ODM
- **JWT** for authentication
- **bcrypt** for password hashing
- **dotenv** for environment variables
- **cors** for cross-origin resource sharing
- **nodemon** for hot reloading

## 📁 **Folder Structure**

```
server/
├── controllers/          # Request handlers for API endpoints
│   ├── userController.js
│   └── todoController.js
├── models/              # Mongoose models for database
│   ├── User.js
│   └── Todo.js
├── routes/              # API routes
│   ├── userRoutes.js
│   └── todoRoutes.js
├── middleware/          # Middleware functions
│   └── auth.js
├── index.js            # Entry point of the application
├── package.json
└── README.md
```

## 🔧 **Development**

### **Running in Development Mode**
```bash
npm run dev
```

### **Running Tests**
```bash
npm test
```

## 🐛 **Troubleshooting**

### **Common Issues**

1. **MongoDB Connection Failed**
   - Ensure MongoDB service is running
   - Check if MongoDB is installed correctly
   - Verify connection string in `.env`

2. **Port Already in Use**
   - Change `PORT` in `.env` file
   - Or kill the process using the port

3. **JWT Token Issues**
   - Ensure `TOKEN_KEY` is set in `.env`
   - Check token expiration (default: 2 hours)

4. **CORS Issues**
   - Ensure frontend URL is allowed in CORS configuration
   - Check if frontend is running on the expected port

## 📝 **Notes**

- The server uses **local MongoDB Compass** by default
- For production, change `MONGODB_URI` to your production MongoDB URL
- JWT tokens expire after 2 hours by default
- All passwords are hashed using bcrypt
- Database collections are automatically created when first user/todo is added
