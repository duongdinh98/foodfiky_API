const Search = require('./../models/searchModel');

// Because searchResultModel.js was not compiled nowhere so cause error
// UnhandledPromiseRejectionWarning: MissingSchemaError: Schema hasn't been registered for model "SearchResult".
// FUCK FUCK WAIT ME WHOLE EVENING !!!
const SearchResult = require('./../models/searchResultModel');

exports.getResult = async (req, res, next) => {
  const keyword = req.params.keyword;

  const result = await Search.findOne({ query: keyword });

  res.status(200).json({
    count: result.recipes.length,
    recipes: result.recipes,
  });
};
