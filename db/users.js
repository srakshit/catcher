'use strict';

const _ = require('lodash');
const knex = require('./knex.js');

function Users() {
    return knex('users');
}

function getByEmail(email) {
    return Users()
            .where('email', email)
            .first();
}

module.exports = {
    getByEmail: getByEmail
};