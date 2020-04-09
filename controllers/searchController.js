const Search = require('./../models/searchModel');

// Because searchResultModel.js was not compiled nowhere so cause error
// UnhandledPromiseRejectionWarning: MissingSchemaError: Schema hasn't been registered for model "SearchResult".
// FUCK FUCK WAIT ME WHOLE EVENING !!!
const SearchResult = require('./../models/searchResultModel');

exports.getResult = async (req, res, next) => {
  try {
    const keyword = req.params.keyword;

    const result = await Search.findOne({ query: keyword });

    result.recipes.forEach((recipe) => {
      recipe.image_url = `${
        process.env.HOST_ADDRESS
      }/image-crawled/${recipe.image_url.split('/').pop()}`;
    });

    res.status(200).json({
      count: result.recipes.length,
      recipes: result.recipes,
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: 'Something went wrong, try again later !',
    });
  }
};
