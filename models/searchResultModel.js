const mongoose = require('mongoose');

const searchResultSchema = new mongoose.Schema({
  publisher: {
    type: String,
  },
  title: {
    type: String,
  },
  source_url: {
    type: String,
  },
  recipe_id: {
    type: String,
  },
  image_url: {
    type: String,
  },
  social_rank: {
    type: Number,
  },
  publisher_url: {
    type: String,
  },
});

const SearchResult = mongoose.model('SearchResult', searchResultSchema);
module.exports = SearchResult;
