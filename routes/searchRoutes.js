const express = require('express');
const searchController = require('./../controllers/searchController');

const router = express.Router();

router.route('/:keyword').get(searchController.getResult);

module.exports = router;
