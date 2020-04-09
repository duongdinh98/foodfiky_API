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

exports.writesJsonToFile = async (inputData, i, fileName) => {
  try {
    const data = JSON.stringify(inputData, null, 2);
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

const removeDuplicationArr = (arr) => {
  return Array.from(new Set(arr));
};

const removeObjectDuplicatedArr = (arr, comp) => {
  const unique = arr
    .map((e) => e[comp])

    // store the keys of the unique objects
    .map((e, i, final) => final.indexOf(e) === i && i)

    // eliminate the dead keys & store unique objects
    .filter((e) => arr[e])
    .map((e) => arr[e]);

  return unique;
};

// 3140 remove duplication -> 2256 recipe_id
exports.getAllRecipeIds = () => {
  let recipeIds = [];

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

  recipeIds = removeDuplicationArr(recipeIds);

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
exports.generateMongoObjectId = () => {
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

exports.generateUniqueObjectIdPerRecipe = (recipe_id) => {
  let ObjectId;

  const data = JSON.parse(
    fs.readFileSync(
      `${__dirname}/JSONDataCrawled/recipe_id_ObjectId-0.json`,
      'utf-8'
    )
  );

  data.data.forEach((el) => {
    if (el.id == recipe_id) {
      ObjectId = el.id_Mongo;
    }
  });

  return ObjectId;
};

exports.saveNormalizedSearchResultToFile = () => {
  const arr = [];

  const data = JSON.parse(
    fs.readFileSync(
      `${__dirname}/JSONDataCrawled/seach-data-modified-0.json`,
      'utf-8'
    )
  );

  data.forEach((el) => {
    el.recipes.forEach((rec) => {
      arr.push(rec);
    });
  });

  const beforeRemoveDuplication = arr.length;
  const normalizedArr = removeObjectDuplicatedArr(arr, '_id');
  const afterRemoveDuplication = normalizedArr.length;

  console.log(
    `Before: ${beforeRemoveDuplication} -- After: ${afterRemoveDuplication}`
  );

  const file = JSON.stringify(normalizedArr, null, 2);
  fs.writeFileSync(
    `${__dirname}/JSONDataCrawled/normalized-search-result.json`,
    file
  );
};

exports.saveNormalizedSearchToFile = () => {
  const arr = [];

  const data = JSON.parse(
    fs.readFileSync(
      `${__dirname}/JSONDataCrawled/seach-data-modified-0.json`,
      'utf-8'
    )
  );

  data.forEach((el) => {
    const recipes_ObjectIds = [];

    el.recipes.forEach((rec) => {
      recipes_ObjectIds.push(rec._id);
    });

    const newObject = {
      recipes: recipes_ObjectIds,
      query: el.query,
    };

    arr.push(newObject);
  });

  const file = JSON.stringify(arr, null, 2);
  fs.writeFileSync(`${__dirname}/JSONDataCrawled/normalized-search.json`, file);
};

// axios({
//   method: 'get',
//   url: 'http://bit.ly/2mTM3nY',
//   responseType: 'stream',
// }).then(function (response) {
//   response.data.pipe(fs.createWriteStream('ada_lovelace.jpg'));
// });
exports.downloadAImage = async (link) => {
  try {
    const imageName = link.split('/').pop();

    const image = await axios({
      method: 'get',
      url: link,
      responseType: 'stream',
    });

    image.data.pipe(
      fs.createWriteStream(`${__dirname}/image-crawled/${imageName}`)
    );
  } catch (err) {
    console.log(`Fail to download image with URL: ${link}`);
  }
};
