const mongoose = require('mongoose');

const searchSchema = new mongoose.Schema({
  recipes: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'SearchResult',
    },
  ],
  query: {
    type: String,
  },
});

const Search = mongoose.model('Search', searchSchema);
module.exports = Search;
