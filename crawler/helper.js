const rp = require('request-promise');
const fs = require('fs');
const cheerio = require('cheerio');
const axios = require('axios');

const uri = 'http://forkify-api.herokuapp.com/phrases.html';

const options = {
  uri: uri,
  transform: (body) => {
    return cheerio.load(body);
  },
};

// rp(options)
//   .then(($) => {
//     // Process html like you would with jQuery...
//   })
//   .catch((err) => {
//     // Crawling failed or Cheerio choked...
//   });

exports.getListKeys = async () => {
  try {
    const listKeys = [];
    console.log('Crawling list keywords...');
    const $ = await rp(options);

    // Process html like you would with jQuery...
    $('.phrases-list li').each(function () {
      listKeys.push($(this).text());
    });

    return listKeys;
  } catch (err) {
    // Crawling failed or Cheerio choked...
    console.log('Crawling failed or Cheerio choked...');
  }
};

exports.writesJsonToFile = async (searchData, i, fileName) => {
  try {
    const data = JSON.stringify(searchData, null, 2);
    fs.writeFileSync(
      `${__dirname}/JSONDataCrawled/${fileName}-${i}.json`,
      data
    );
    console.log(`Finished clone JSON to ${fileName}.json !`);
  } catch (err) {
    console.log('Error with writesJsonToFile() function !');
  }
};

exports.callOriginalAPI = async (url, key) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `${url}${key}`,
    });

    res.data.query = key;

    return res.data;
  } catch (err) {
    console.log(`API call with key: ${key} has failed !`);
  }
};

// 3140 recipe_id
exports.getAllRecipeIds = () => {
  const recipeIds = [];

  for (let i = 8; i <= 128; i += 8) {
    const searchResults = JSON.parse(
      fs.readFileSync(
        `${__dirname}/JSONDataCrawled/seach-data-${i}.json`,
        'utf-8'
      )
    );

    searchResults.forEach((result) => {
      if (result) {
        result.recipes.forEach((recipe) => {
          recipeIds.push(recipe.recipe_id);
        });
      }
    });
  }

  const recipeIdData = {
    status: 'crawled',
    length: recipeIds.length,
    data: recipeIds,
  };

  const data = JSON.stringify(recipeIdData, null, 2);
  fs.writeFileSync(`${__dirname}/JSONDataCrawled/recipe_id.json`, data);

  return recipeIds;
};

exports.getAllRecipeIdsMinFile = () => {
  const data = JSON.parse(
    fs.readFileSync(`${__dirname}/JSONDataCrawled/recipe_id.json`, 'utf-8')
  );

  return data.data;
};

// MongoDB ObjectId generator
exports.mongoObjectId = () => {
  const timestamp = ((new Date().getTime() / 1000) | 0).toString(16);
  return (
    timestamp +
    'xxxxxxxxxxxxxxxx'
      .replace(/[x]/g, function () {
        return ((Math.random() * 16) | 0).toString(16);
      })
      .toLowerCase()
  );
};
