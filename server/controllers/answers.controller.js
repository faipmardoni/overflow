const User = require('../models/user.model')
const Question = require('../models/question.model')
const Answer = require('../models/answer.model')

module.exports = {
  addDoc(req, res) {
    // const { content, userId, questionId } = req.body
    Answer.create(req.body)
      .then((result) => {
        User.findByIdAndUpdate(result.userId, {
          $push: {
            answers: result._id
          }
        })
          .exec()
          .then(user => {
            Question.findByIdAndUpdate(result.questionId, {
              $push: {
                answers: result._id
              }
            })
            .exec()
            .then(question => {
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
  getDocs(req, res) {
    Answer.find()
      .populate('userId')
      .populate('questionId')
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
    Answer.findById(req.params.id)
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
    const { content } = req.body
    Answer.findByIdAndUpdate(req.params.id, {
      content
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
    Answer.findByIdAndRemove(req.params.id)
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
    Answer.findById(req.params.id)
      .exec()
      .then(answer => {
        let isFound = false
        answer.upVote.forEach(u => {
          if (u == userId) {
            isFound = true
          }
        })
        if (!isFound) {
          Answer.findByIdAndUpdate(req.params.id, {
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
    Answer.findById(req.params.id)
      .exec()
      .then(answer => {
        let isFound = false
        answer.upVote.forEach(u => {
          if (u == userId) {
            isFound = true
          }
        })
        if (!isFound) {
          Answer.findByIdAndUpdate(req.params.id, {
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