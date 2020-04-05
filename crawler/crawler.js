const helper = require('./helper');

const executeWork = async (i, j) => {
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

function start(counter) {
  if (counter < 128) {
    setTimeout(async function () {
      const i = counter;
      const j = counter + 8;
      counter += 8;

      await executeWork(i, j);

      start(counter);
    }, 5000);
  }
}
start(0);
