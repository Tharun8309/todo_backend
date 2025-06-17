const User = require("../model/UserModel");
const { createSecretToken } = require("../utils/SecretToken");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const cookieOptions = {
  httpOnly: true,
  secure:false,
  sameSite: 'lax',
  maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days in milliseconds
  path: '/'
};

module.exports.Signup = async (req, res, next) => {
  try {
    console.log("User came for registration ");
    console.log(req.body);
    const { email, password, username, name } = req.body;
    
    // Validate required fields
    if (!email || !password || !username) {
      return res.status(400).json({ 
        message: "All fields are required", 
        success: false 
      });
    }

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: "User already exists", 
        success: false 
      });
    }

    // Create new user
    const user = await User.create({ email, name, username, password });
    const token = createSecretToken(user._id);
    
    res.cookie("token", token, cookieOptions);

    res.status(201).json({ 
      message: "User signed in successfully", 
      success: true, 
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
    
  } catch (error) {
    console.log(error);
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: Object.values(error.errors).map(err => err.message).join(', '), 
        success: false 
      });
    }
    // Handle other errors
    res.status(500).json({ 
      message: error.message, 
      success: false, 
    });
  }
};

module.exports.Login = async (req, res) => {
    try {
      console.log(req.body);
      const { email, password } = req.body;
      if(!email || !password ){
        return res.status(400).json({message:'All fields are required', success: false })
      }
      const user = await User.findOne({ email });
      if(!user){
        return res.status(400).json({message:'Incorrect password or email', success: false }) 
      }
      const auth = await bcrypt.compare(password, user.password)
      if (!auth) {
        return res.status(400).json({message:'Incorrect password or email', success: false }) 
      }
      const token = createSecretToken(user._id);
      res.cookie("token", token, cookieOptions);
      return res.status(201).json({ 
        message: "User logged in successfully", 
        success: true,
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        }
      });
    } catch (error) {
        return res.status(500).json({ 
            message: error.message, 
            success: false,
        });
    }
}

module.exports.verifyToken = async (req, res) => {
  try {
    const token = req.cookies.token;
    console.log("Token received for verification:", token);
    if (!token) {
      return res.status(401).json({ 
        message: "No token provided", 
        success: false 
      });
    }

    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ 
        message: "User not found", 
        success: false 
      });
    }

    // Refresh the token
    const newToken = createSecretToken(user._id);
    res.cookie("token", newToken, cookieOptions);

    res.status(200).json({ 
      message: "Token is valid", 
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ 
      message: "Invalid token", 
      success: false 
    });
  }
};
