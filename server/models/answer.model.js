const mongoose = require('mongoose')
const schema = mongoose.Schema

const aSchema = new schema({
  content: { type: String, required: true },
  upVote: [{ type: schema.Types.ObjectId, ref: 'User' }],
  downVote: [{ type: schema.Types.ObjectId, ref: 'User' }],
  questionId: { type: schema.Types.ObjectId, ref: 'Question' },
  userId: {
    type: schema.Types.ObjectId, ref: 'User',
  }
}, {
    timestamps: true
  })

const Answer = mongoose.model('Answer', aSchema)

module.exports = Answer