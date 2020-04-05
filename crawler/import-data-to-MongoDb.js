const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Recipe = require('./../models/recipeModel');

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
  fs.readFileSync(`${__dirname}/JSONDataCrawled/detail-data-3139.json`, 'utf-8')
);

const importRecipeData = async () => {
  const recipes = [];

  data.forEach((recipe) => {
    recipes.push(recipe.recipe);
  });

  await Recipe.create(recipes);
  console.log('Recipes data successfully loaded!');
};

if (process.argv[2] === '--importRecipe') {
  importRecipeData();
} else if (process.argv[2] === '--importSomething') {
}
