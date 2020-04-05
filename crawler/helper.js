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
    let listKeys = [];
    console.log('Crawling list keywords...');
    const $ = await rp(options);

    // Process html like you would with jQuery...
    $('.phrases-list li').each(function (index) {
      listKeys.push($(this).text());
    });

    return listKeys;
  } catch (err) {
    // Crawling failed or Cheerio choked...
    console.log('Crawling failed or Cheerio choked...');
  }
};

exports.writesJsonToFile = async (searchData, i) => {
  try {
    const data = JSON.stringify(searchData, null, 2);
    fs.writeFileSync(`${__dirname}/JSONDataCrawled/seach-data-${i}.json`, data);
    console.log('Finished clone JSON to search-data.json !');
  } catch (err) {
    console.log('Error with writesJsonToFile() function !');
  }
};

exports.callOriginalAPI = async (key) => {
  try {
    let res = await axios({
      method: 'GET',
      url: `https://forkify-api.herokuapp.com/api/search?q=${key}`,
    });

    res.data.query = key;

    return res.data;
  } catch (err) {
    console.log(`API call with key: ${key} has failed !`);
  }
};
