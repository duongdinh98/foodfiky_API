const express = require('express');
const recipeController = require('./../controllers/recipeController');

const router = express.Router();

router.route('/:id').get(recipeController.getResult);

module.exports = router;
