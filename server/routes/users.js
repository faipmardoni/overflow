var express = require('express');
var router = express.Router();

const {
  authentication,
  authorization
} = require('../middlewares/auth')

const {
  showUsers,
  addUsers,
  deleteUser,
  updateUser,
  detailUser,
  loginFB,
  login
} = require('../controllers/users.controller')

router.get('/', showUsers)
router.post('/', addUsers)
router.post('/login', login)
router.post('/loginfb', loginFB)
router.get('/:id', authentication, detailUser)
router.delete('/:id', authentication, authorization, deleteUser)
router.put('/:id', authentication, authorization, updateUser)

module.exports = router

