"use strict";
const pool = require('./dbConnection');

async function fetchCategories() {
    const query = 'SELECT name FROM categories';
    const result = await pool.query(query);
    return result.rows;

}

async function fetchJokesByCategory(params, limit) {
    const query = "SELECT setup, delivery FROM jokes JOIN categories ON jokes.category_id = categories.id WHERE categories.name = $1";

    if(limit) {
        const limitQuery = parseInt(limit);
        query += " LIMIT ${limitQuery}";
    }

    const result = await pool.query(query, params);
    return result.rows;
}

async function fetchRandomJoke() {
    const query = "SELECT setup, delivery FROM jokes ORDER BY RANDOM() LIMIT 1";
    const result = await pool.query(query);
    return result.rows[0];
}

async function addJoke(category, setup, delivery) {
    const categoryQuery = "SELECT id FROM categories WHERE name = $1";
    const categoryRes = await pool.query(categoryQuery, [category]);

    if(categoryRes.rows.length === 0) {
        throw new Error('Category not found');
    }

    const categoryId = categoryRes.rows[0].id;

    let  query = "INSERT INTO jokes (category_id, setup, delivery) VALUES ($1, $2, $3) RETURNING *";
    let values = [categoryId, setup, delivery];
    const result = await pool.query(query, values);
    return result.rows[0];


}

module.exports = {
    fetchCategories,
    fetchJokesByCategory,
    fetchRandomJoke, 
    addJoke
};