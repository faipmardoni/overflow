const User = require('../models/user.model')
const Question = require('../models/question.model')
const Answer = require('../models/answer.model')

module.exports = {
  addDoc(req, res) {
    Question.create(req.body)
      .then((result) => {
        User.findByIdAndUpdate(result.userId, {
          $push: {
            questions: result._id
          }
        })
          .exec()
          .then(user => {
            res.status(200).json({
              message: 'success',
              result
            })
          })
      }).catch((err) => {
        res.status(400).json({
          message: 'failed',
          err
        })
      });
  },
  getDocs(req, res) {
    Question.find()
      .populate('userId')
      .populate('answers')
      .exec()
      .then((result) => {
        res.status(200).json({
          message: 'success',
          result
        })
      }).catch((err) => {
        res.status(400).json({
          message: 'failed',
          err
        })
      });
  },
  getDocById(req, res) {
    Question.findById(req.params.id)
      .populate('userId')
      .populate('answers')
      .exec()
      .then((result) => {
        res.status(200).json({
          message: 'success',
          result
        })
      }).catch((err) => {
        res.status(400).json({
          message: 'failed',
          err
        })
      });
  },
  editDoc(req, res) {
    const image = req.imageURL
    const { title, content, userId } = req.body
    Question.findByIdAndUpdate(req.params.id, {
      title, content, image
    })
      .exec()
      .then((result) => {
        res.status(200).json({
          message: 'success',
          result
        })
      }).catch((err) => {
        res.status(400).json({
          message: 'failed',
          err
        })
      });
  },
  deleteDoc(req, res) {
    Question.findByIdAndRemove(req.params.id)
      .exec()
      .then((result) => {
        User.findByIdAndUpdate(result.userId, {
          $pull: {
            questions: result._id
          }
        })
          .then(user => {
            Answer.deleteMany({
              questionId: req.params.id
            })
              .exec()
              .then(answer => {
                res.status(200).json({
                  message: 'success',
                  result
                })
              })
          })
      }).catch((err) => {
        res.status(400).json({
          message: 'failed',
          err
        })
      });
  },
  upVote(req, res) {
    const { userId } = req.body
    Question.findById(req.params.id)
      .exec()
      .then(question => {
        let isFound = false
        question.upVote.forEach(u => {
          if (u == userId) {
            isFound = true
          }
        })
        if (!isFound) {
          Question.findByIdAndUpdate(req.params.id, {
            $push: {
              upVote: userId
            }
          })
            .exec()
            .then((result) => {
              res.status(200).json({
                message: 'success',
                result
              })
            })
        } else {
          res.status(401).json({
            message: 'failed user has already upvoted'
          })
        }
      })
      .catch((err) => {
        res.status(400).json({
          message: 'failed',
          err
        })
      });
  },
  downVote(req, res) {
    const { userId } = req.body
    Question.findById(req.params.id)
      .exec()
      .then(question => {
        let isFound = false
        question.downVote.forEach(u => {
          if (u == userId) {
            isFound = true
          }
        })
        if (!isFound) {
          Question.findByIdAndUpdate(req.params.id, {
            $push: {
              downVote: userId
            }
          })
            .exec()
            .then((result) => {
              res.status(200).json({
                message: 'success',
                result
              })
            })
        } else {
          res.status(401).json({
            message: 'failed user has already downVote'
          })
        }
      })
      .catch((err) => {
        res.status(400).json({
          message: 'failed',
          err
        })
      });
  }
}