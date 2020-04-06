const helper = require('./helper');
const fs = require('fs');

(function () {
  const result = [];
  const data = JSON.parse(
    fs.readFileSync(`${__dirname}/JSONDataCrawled/recipe_id.json`, 'utf-8')
  );

  data.data.forEach((el) => {
    const newObj = {
      id: el,
      id_Mongo: helper.generateMongoObjectId(),
    };

    result.push(newObj);
  });

  const file = {
    status: 'crawled and added ObjectId',
    length: result.length,
    data: result,
  };

  helper.writesJsonToFile(file, 0, 'recipe_id_ObjectId');
})();
