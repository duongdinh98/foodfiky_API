const Recipe = require('./../models/recipeModel');
const redis = require('redis');

const client = redis.createClient({
  host: process.env.REDIS_HOST || '127.0.0.1', // this must match the container name of redis image
  port: process.env.REDIS_PORT || 6379,
});

exports.getResult = async (req, res, next) => {
  const id = req.params.id;

  client.get(`recipe-result:${id}`, async (err, result) => {
    if (result) {
      const resultAsJSON = JSON.parse(result);
      return res.status(200).json(resultAsJSON);
    } else {
      const recipe = await Recipe.findOne({ recipe_id: id }).select(
        '-_id -__v'
      );

      if (recipe) {
        recipe.image_url = `${
          process.env.HOST_ADDRESS
        }/image-crawled/${recipe.image_url.split('/').pop()}`;

        client.setex(
          `recipe-result:${id}`,
          3600,
          JSON.stringify({
            source: 'Food API Redis Cache',
            recipe: recipe,
          })
        );

        res.status(200).json({
          recipe,
        });
      } else {
        res.status(404).json({
          error: `Cannot find the recipe with this id ${req.params.id}`,
        });
      }
    }
  });
};
