const helper = require('./helper');

const executeSearchWorks = async (i, j) => {
  //   Collecting 128 keywords from <li></li> in .html file
  //   Arr [0, 1, 2, ...127]
  //   Loop 16 iterations - 8 per iteration
  const listKeys = await helper.getListKeys();

  const listKeysTemp = [];
  for (i; i < j; i += 1) {
    listKeysTemp.push(listKeys[i]);
  }

  //   Call to original API based on keywords collected
  const searchPromises = listKeysTemp.map(async (keyword) => {
    return helper.callOriginalAPI(
      'https://forkify-api.herokuapp.com/api/search?q=',
      keyword
    );
  });

  const searchResults = await Promise.all(searchPromises);

  helper.writesJsonToFile(searchResults, i, 'seach-data');

  console.log('Done !');
};

function startSearchSpider(counter) {
  if (counter < 128) {
    setTimeout(async function () {
      const i = counter;
      const j = counter + 8;
      counter += 8;

      await executeSearchWorks(i, j);

      startSearchSpider(counter);
    }, 5000);
  }
}

// startSearchSpider(0);

// helper.getAllRecipeIds();  // Generate recipe_id.json
const executeDetailWorks = async (i, j) => {
  console.log('Running detailSpider...');
  const recipeIds = helper.getAllRecipeIdsMinFile();

  const listIdsTemp = [];
  for (i; i < j; i += 1) {
    listIdsTemp.push(recipeIds[i]);
  }

  const detailPromises = listIdsTemp.map(async (id) => {
    return helper.callOriginalAPI(
      'https://forkify-api.herokuapp.com/api/get?rId=',
      id
    );
  });

  const detailResults = await Promise.all(detailPromises);

  helper.writesJsonToFile(detailResults, j, 'detail-data');
  console.log('Done !');
};

if (process.argv[2] === '--searchSpider') {
  startSearchSpider(0);
} else if (process.argv[2] === '--detailSpider') {
  executeDetailWorks(0, 2256);
}
