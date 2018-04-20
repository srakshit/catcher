'use strict';

let knex = require('./knex.js');

function Catchers() {
    return knex('catchers');
}

function getByEmail(email) {
    return Catchers()
            .innerJoin('users', 'catchers.user_id', 'users.id')
            .where('email', email)
            .first();
}

function add(catcher) {
    return Catchers().insert(catcher, 'catcher_id');
}

function deleteById(id) {
    return Catchers().where('user_id', id).del();
}

module.exports = {
    getByEmail: getByEmail,
    add: add,
    deleteById: deleteById
};