// middleware/verifyToken.js
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  console.log(req.cookies.token);
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token", success: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = decoded; // ✅ Save decoded data (like user.id) into request object
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized: Invalid token", success: false });
  }
};

module.exports = verifyToken;
