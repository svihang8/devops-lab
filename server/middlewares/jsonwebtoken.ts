const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../constants');


const signToken = (payload = {}, expiresIn = '12hr') => {
  try {
    console.log(JWT_SECRET);
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: expiresIn })

    return token;

  } catch (error) {
    console.error(error);
  }
};

const verifyToken = (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      res.status(401).json({
        message: 'missing JWT'
      });
    }

    const auth = jwt.verify(token, JWT_SECRET);

    if (!auth) {
      res.status(401).json({
        message: 'JWT not valid'
      })
    }

    req.auth = auth;

    next();

  } catch (error) {
    res.status(500).send();
  }
};

module.exports = { signToken, verifyToken };