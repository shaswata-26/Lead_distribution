const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  totalRecords: {
    type: Number,
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['processing', 'distributed', 'failed'],
    default: 'processing'
  },
  distribution: [{
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Agent'
    },
    count: Number
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('List', listSchema);