var express = require('express');
var router = express.Router();

const {
  authentication,
  authorization
} = require('../middlewares/auth')

const {
  addDoc,
  getDocs,
  getDocById,
  editDoc,
  deleteDoc,
  upVote,
  downVote
} = require('../controllers/answers.controller')

router.post('/', authentication, addDoc)
router.get('/', authentication, getDocs)
router.get('/:id', authentication, getDocById)
router.put('/:id', authentication, editDoc)
router.delete('/:id', authentication, deleteDoc)
router.put('/:id/up-vote', authentication, upVote)
router.put('/:id/down-vote', authentication, downVote)

module.exports = router

