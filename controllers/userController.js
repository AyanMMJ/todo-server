const User = require("../models/User"); // Import User Model Schema
const bcrypt = require("bcryptjs"); // Import Bcrypt Package
const jwt = require("jsonwebtoken"); // Import Jsonwebtoken Package
require("dotenv").config(); // Import dotenv Package

// Register User
exports.register = async (req, res) => {
  try {
    // Get user input
    const { first_name, last_name, email, password, picture } = req.body;

    // Validate user input
    if (!(email && password && first_name && last_name)) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Check if user already exists
    const oldUser = await User.findOne({ email: email.toLowerCase() });

    if (oldUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists. Please login"
      });
    }

    // Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(),
      password: encryptedPassword,
      picture: picture || null
    });

    // Create token (support TOKEN_KEY and legacy TOKEN)
    const jwtSecret = process.env.TOKEN_KEY || process.env.TOKEN || 'your-secret-key';
    const token = jwt.sign(
      { user_id: user._id, email: user.email },
      jwtSecret,
      {
        expiresIn: "2h",
      }
    );
    
    // Return new user and token (without password)
    const userResponse = {
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      picture: user.picture,
      token: token
    };

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: userResponse
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({
      success: false,
      message: "Server error during registration"
    });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }
    
    // Validate if user exists in our database
    const user = await User.findOne({ email: email.toLowerCase() });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token (support TOKEN_KEY and legacy TOKEN)
      const jwtSecret = process.env.TOKEN_KEY || process.env.TOKEN || 'your-secret-key';
      const token = jwt.sign(
        { user_id: user._id, email: user.email },
        jwtSecret,
        {
          expiresIn: "2h",
        }
      );

      // Update user token
      user.token = token;
      await user.save();

      // Send user response (without password)
      const userResponse = {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        picture: user.picture,
        token: token
      };

      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: userResponse
      });
    }

    // Invalid credentials
    return res.status(400).json({
      success: false,
      message: "Invalid credentials"
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      success: false,
      message: "Server error during login"
    });
  }
};

