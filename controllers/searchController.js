const Search = require('./../models/searchModel');
const redis = require('redis');

// Because searchResultModel.js was not compiled nowhere so cause error
// UnhandledPromiseRejectionWarning: MissingSchemaError: Schema hasn't been registered for model "SearchResult".
// FUCK FUCK WAIT ME WHOLE EVENING !!!
const SearchResult = require('./../models/searchResultModel');
const client = redis.createClient({
  host: process.env.REDIS_HOST || '127.0.0.1', // this must match the container name of redis image
  port: process.env.REDIS_PORT || 6379,
});

exports.getResult = async (req, res, next) => {
  const keyword = req.params.keyword;

  // Try fetching the result from Redis first in case we have it cached
  client.get(`search-result:${keyword}`, async (err, result) => {
    if (result) {
      const resultAsJSON = JSON.parse(result);
      return res.status(200).json(resultAsJSON);
    } else {
      // Key does not exist in Redis store
      // Fetch data directly from Mongo Server
      const result = await Search.findOne({ query: keyword });

      if (result) {
        result.recipes.forEach((recipe) => {
          recipe.image_url = `${
            process.env.HOST_ADDRESS
          }/image-crawled/${recipe.image_url.split('/').pop()}`;
        });

        const responseData = {
          count: result.recipes.length,
          recipes: result.recipes,
        };

        // Save the API data response in Redis store (stored 3600s )
        client.setex(
          `search-result:${keyword}`,
          3600,
          JSON.stringify({
            source: 'Food API Redis Cache',
            ...responseData,
          })
        );

        res.status(200).json(responseData);
      } else {
        res.status(400).json({
          error:
            "Couldn't find recipe with that name. Please visit https://f2fapi.herokuapp.com/queries.html for all available search queries",
        });
      }
    }
  });
};
