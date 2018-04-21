'use strict';

const _ = require('lodash');
const knex = require('./knex.js');

function Users() {
    return knex('users');
}

function Catchers() {
    return knex('catchers');
}

function getByEmail(email) {
    return Catchers()
            .innerJoin('users', 'catchers.user_id', 'users.id')
            .where('email', email)
            .first();
}

function getById(id) {
    return Catchers()
            .innerJoin('users', 'catchers.user_id', 'users.id')
            .where('catcher_id', id)
            .first();
}

function add(catcher, catcherIdPrefix) {  
    return knex.transaction(function (t) {
        return Users()
            .transacting(t)
            .insert(catcher, 'id')
            .then(function (id) {
                return Catchers()
                    .transacting(t)
                    .insert({catcher_id: catcherIdPrefix + _.padStart(id[0], 6, '0'), user_id: id[0]}, 'catcher_id')
            })
            .then(t.commit)
            .catch(t.rollback)
    });
}

function deleteByUserId(id) {
    return knex.transaction(function (t) {
        return Catchers()
            .transacting(t)
            .del()
            .where('user_id', id)
            .then(function (response) {
                return Users()
                    .transacting(t)
                    .del()
                    .where('id', id)
            })
            .then(t.commit)
            .catch(t.rollback)
    });
}

module.exports = {
    getByEmail: getByEmail,
    getById: getById,
    add: add,
    deleteByUserId: deleteByUserId
};