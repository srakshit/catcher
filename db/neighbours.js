'use strict';

let knex = require('./knex.js');

function Catchers() {
    return knex('catchers');
}

function getAll() {
    return Catchers().select();
}

function getByPhone(phone) {
    return Catchers().where('phone', phone).first();
}

function getById(id) {
    return Catchers().where('id', id).first();
}

function add(catcher) {
    return Catchers().insert(catcher, 'id');
}

function deleteByPhone(phone) {
    return Catchers().where('phone', phone).del();
}

module.exports = {
    getAll: getAll,
    getByPhone: getByPhone,   
    getById: getById, 
    add: add,
    deleteByPhone: deleteByPhone
};