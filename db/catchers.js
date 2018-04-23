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

function update(catcher) {
    let userObj = {};
    let catcherObj = {};
    
    if (catcher.firstName) {
        userObj.firstName = catcher.firstName;
    }
    if (catcher.lastName) {
        userObj.lastName = catcher.lastName;
    }
    if (catcher.address) {
        userObj.address = catcher.address;
    }
    if (catcher.city) {
        userObj.city = catcher.city;
    }
    if (catcher.county) {
        userObj.county = catcher.county;
    }
    if (catcher.postcode) {
        userObj.postcode = catcher.postcode;
    }
    if (catcher.phone) {
        userObj.phone = catcher.phone;
    }
    if (catcher.firstName) {
        userObj.firstName = catcher.firstName;
    }

    if (catcher.isActive !== undefined) {
        catcherObj.isActive = catcher.isActive;
    }

    
    if (!_.isEmpty(userObj) && !_.isEmpty(catcherObj)) {
        //Update both Users and Catchers table
        return knex.transaction(function (t) {
            return Users()
                .transacting(t)
                .where('email', catcher.email)
                .update(userObj)
                .then(function (id) {
                    return Catchers()
                        .transacting(t)
                        .where('catcher_id', catcher.id)
                        .update(catcherObj)
                })
                .then(t.commit)
                .catch(t.rollback)
        });
    }else if (!_.isEmpty(userObj)){
        //Update Users table only
        return knex.transaction(function (t) {
            return Users()
                .transacting(t)
                .where('email', catcher.email)
                .update(userObj)
                .then(t.commit)
                .catch(t.rollback)
        });
    }else if (!_.isEmpty(catcherObj)) {
        //Update Catchers table only
        return knex.transaction(function (t) {
            return Catchers()
                .transacting(t)
                .where('catcher_id', catcher.id)
                .update(catcherObj)
                .then(t.commit)
                .catch(t.rollback)
        });
    }   
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
    deleteByUserId: deleteByUserId,
    update: update
};