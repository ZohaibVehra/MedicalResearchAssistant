const mongoose = require('mongoose')

const searchSchema = new mongoose.Schema({
  rawQuery: { type: String, required: true, index: true },
  total: { type: Number, required: true }, //note capped to always be 100 or less by service

  latest: {
    type: [{
      title: { type: String, required: true },
      authors: { type: String, default: '' },
      publishedYear: { type: String, default: null },
      publishedDate: { type: String, default: null },
      citations: { type: Number, default: 0 },
      doi: { type: String, default: null },
      free: { type: Boolean, default: false }
    }],
    default: []
  },
  relevant: {
    type: [{
      title: { type: String, required: true },
      authors: { type: String, default: '' },
      publishedYear: { type: String, default: null },
      publishedDate: { type: String, default: null },
      citations: { type: Number, default: 0 },
      doi: { type: String, default: null },
      free: { type: Boolean, default: false }
    }],
    default: []
  },
  mostCited: {
    type: [{
      title: { type: String, required: true },
      authors: { type: String, default: '' },
      publishedYear: { type: String, default: null },
      publishedDate: { type: String, default: null },
      citations: { type: Number, default: 0 },
      doi: { type: String, default: null },
      free: { type: Boolean, default: false }
    }],
    default: []
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }
}, { timestamps: true })

searchSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
  }
})

module.exports = mongoose.model('Search', searchSchema)
