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

searchSchema.pre(/^find/, function (next) {
  this.populate({ path: 'recipes', select: '-_id -__v' });

  next();
});

const Search = mongoose.model('Search', searchSchema);
module.exports = Search;
