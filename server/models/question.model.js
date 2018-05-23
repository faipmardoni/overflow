const mongoose = require('mongoose')
const schema = mongoose.Schema

const qSchema = new schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  upVote: [{ type: schema.Types.ObjectId, ref: 'User' }],
  downVote: [{ type: schema.Types.ObjectId, ref: 'User' }],
  answers: [{ type: schema.Types.ObjectId, ref: 'Answer' }],
  userId: {
    type: schema.Types.ObjectId, ref: 'User',
  },
}, {
    timestamps: true
  })

const Question = mongoose.model('Question', qSchema)

module.exports = Question