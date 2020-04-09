const Recipe = require('./../models/recipeModel');

exports.getResult = async (req, res, next) => {
  const id = req.params.id;

  const result = await Recipe.findOne({ recipe_id: id }).select('-_id -__v');

  res.status(200).json({
    recipe: result,
  });
};
