const jwt = require("jsonwebtoken"); // used to create, sign, and verify tokens

const config = process.env; // get config vars

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"] || req.headers["authorization"]?.replace('Bearer ', ''); // Get token from body, query, headers, or Authorization header

  // Check if token exists
  if (!token) {
    return res.status(403).json({
      success: false,
      message: "A token is required for authentication"
    });
  }
  
  try {
    const jwtSecret = config.TOKEN_KEY || config.TOKEN || 'your-secret-key';
    const decoded = jwt.verify(token, jwtSecret); // Verify token
    req.user = decoded; // Save decoded token to request object
    next(); // If token is valid, continue
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

module.exports = verifyToken;