const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
  name1: { type: String, required: true },
  name2: { type: String, required: true },
  flamesResult: { type: String, required: true },
  calculationDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Result', ResultSchema);
