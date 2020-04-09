const Recipe = require('./../models/recipeModel');

exports.getResult = async (req, res, next) => {
  try {
    const id = req.params.id;

    const result = await Recipe.findOne({ recipe_id: id }).select('-_id -__v');
    result.image_url = `${
      process.env.HOST_ADDRESS
    }/image-crawled/${result.image_url.split('/').pop()}`;

    res.status(200).json({
      recipe: result,
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: 'Something went wrong, try again later !',
    });
  }
};
