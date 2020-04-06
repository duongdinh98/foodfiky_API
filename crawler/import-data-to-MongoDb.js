const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Recipe = require('./../models/recipeModel');
const helper = require('./helper');

const SearchResult = require('./../models/searchResultModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful!'));

const data = JSON.parse(
  fs.readFileSync(`${__dirname}/JSONDataCrawled/detail-data-2256.json`, 'utf-8')
);

const importRecipeData = async () => {
  try {
    console.log('Importing RecipeData to MongoDD...');
    const recipes = [];

    data.forEach((recipe) => {
      recipes.push(recipe.recipe);
    });

    await Recipe.create(recipes);
    console.log('Recipes data successfully loaded!');
  } catch (error) {
    console.log(err);
  }

  process.exit();
};

const deleteRecipeData = async () => {
  try {
    await Recipe.deleteMany();
    console.log('Recipes data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const addIdToSearchResult = () => {
  const data = [];

  for (let i = 8; i <= 128; i += 8) {
    const seachResult = JSON.parse(
      fs.readFileSync(
        `${__dirname}/JSONDataCrawled/seach-data-${i}.json`,
        'utf-8'
      )
    );

    seachResult.forEach((el) => {
      if (el) {
        data.push(el);
      }
    });
  }

  data.forEach((result) => {
    result.recipes.forEach((recipe) => {
      recipe._id = helper.generateUniqueObjectIdPerRecipe(recipe.recipe_id);
    });
  });

  return data;
};

const saveModifiedSearchData = () => {
  const dataWithAddedId = addIdToSearchResult();

  helper.writesJsonToFile(dataWithAddedId, 0, 'seach-data-modified');
};

const importSearchResult = async () => {
  // helper.saveNormalizedSearchResultToFile();

  try {
    console.log('Importing SearchResultData to MongoDD...');

    const searchResults = JSON.parse(
      fs.readFileSync(
        `${__dirname}/JSONDataCrawled/normalized-search-result.json`,
        'utf-8'
      )
    );

    await SearchResult.create(searchResults);
    console.log('SearchResultData successfully loaded!');
  } catch (error) {
    console.log(err);
  }

  process.exit();
};

if (process.argv[2] === '--importRecipe') {
  importRecipeData();
} else if (process.argv[2] === '--deleteRecipe') {
  deleteRecipeData();
} else if (process.argv[2] === '--normalizationSearchData') {
  saveModifiedSearchData();
} else if (process.argv[2] === '--importSearchResult') {
  importSearchResult();
}
