"use strict";
const model = require('../models/jokeModel');

async function fetchCategories(req, res) {
    try {
        const categories = await model.fetchCategories();
        res.json(categories);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }

}

async function fetchJokesByCategory(req, res) {
    const category = req.params.category;
    const limit = req.query.limit;
    let params;

    if (category) {
        try {
            params = [category];
            
            const jokes = await model.fetchJokesByCategory(params, limit);
            res.json(jokes);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(400).json({ error: 'Bad Request: Missing category parameter' });
    }
}

async function fetchRandomJoke(req, res) {
    try {
        const joke = await model.fetchRandomJoke();
        res.json(joke);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }

}

async function createJoke(req, res) {
    const { category, setup, delivery } = req.body;
    
    if (category && setup && delivery) {
        try{
            const newJoke = await model.addJoke(category, setup, delivery);
            res.status(201).json(newJoke);
        } catch(err){
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(400).json({ error: 'Bad Request: Missing required fields' });
    }
}


module.exports = {
    fetchCategories,
    fetchJokesByCategory,
    fetchRandomJoke,
    createJoke
};