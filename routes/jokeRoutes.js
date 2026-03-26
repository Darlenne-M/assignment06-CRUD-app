"use strict";
const express = require("express");
const router = express.Router();
const jokeController = require('../controllers/jokeController');

router.get('/categories', jokeController.fetchCategories);
router.get('/categories/:category', jokeController.fetchJokesByCategory);
router.get('/random', jokeController.fetchRandomJoke);
router.post('/add', jokeController.createJoke);

module.exports = router;