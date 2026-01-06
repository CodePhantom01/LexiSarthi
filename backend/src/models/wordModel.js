const mongoose = require("mongoose");

const wordSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true
  },
  meaningHindi: {
    type: String,
    required: true
  },
  pronunciation: {
    type: String
  },
  example: {
    type: [String],
    maxlength: 4   // only 4 (2 English + 2 Hindi)
  },
  synonyms: [String],
  antonyms: [String]
});

module.exports = mongoose.model("Word", wordSchema);
