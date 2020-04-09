const fs = require('fs');
const helper = require('./helper');
const cwait = require('cwait');

const MAX_SIMULTANEOUS_DOWNLOADS = 5;

const runCrawler = async () => {
  console.log('Starting crawler...');
  const data = JSON.parse(
    fs.readFileSync(
      `${__dirname}/JSONDataCrawled/normalized-search-result.json`,
      'utf-8'
    )
  );

  const urlArr = data.map((el) => el.image_url);

  const removedDuplUrlArr = Array.from(new Set(urlArr));

  const queue = new cwait.TaskQueue(Promise, MAX_SIMULTANEOUS_DOWNLOADS);

  console.log(`Downloading ${removedDuplUrlArr.length} images...`);

  const imagePromise = removedDuplUrlArr.map(
    queue.wrap(async (url) => await helper.downloadAImage(url))
  );

  await Promise.all(imagePromise);

  console.log('Done !');
  process.exit();
};

if (process.argv[2] === '--start') {
  runCrawler();
}
