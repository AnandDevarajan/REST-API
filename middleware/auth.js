const jwt = require('jsonwebtoken');
require('dotenv').config();
module.exports = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({
      message: 'ACCESS DENIED',
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'ACCESS DENIED', error });
  }
};
