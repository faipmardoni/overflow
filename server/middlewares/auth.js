const jwt = require('jsonwebtoken')

module.exports = {
  authentication: (req, res, next) => {
    const { token } = req.headers
    jwt.verify(token, process.env.MY_SECRET, (error, result) => {
      if (!error) {
        req.headers.result = result
        next()
      } else {
        return res.status(403).json({
          message: 'Invalid Token'
        })
      }
    })
  },
  authorization(req, res, next) {
    const { token } = req.headers
    const decoded = jwt.decode(token)
    if (decoded.role == 'admin') {
      return next()
    } else {
      return res.status(401).json({
        message: 'You dont have access'
      })
    }
  }
}