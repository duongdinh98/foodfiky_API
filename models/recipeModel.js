const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  publisher: {
    type: String,
  },
  ingredients: {
    type: Array,
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
  title: {
    type: String,
  },
});

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;
