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
    return helper.callOriginalAPI(keyword);
  });

  const searchResults = await Promise.all(searchPromises);

  helper.writesJsonToFile(searchResults, i);

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

if (process.argv[2] === '--searchSpider') {
  startSearchSpider(0);
} else if (process.argv[2] === '--detailsSpider') {
  console.log('...');
}
