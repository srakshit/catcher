'use strict';

const _ = require('lodash');
const knex = require('./knex.js');

function Users() {
    return knex('users');
}

function Catchers() {
    return knex('catchers');
}

function CatcherAllocation() {
    return knex('catcher_allocation');
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

function getByUid(uid) {
    return Catchers()
            .innerJoin('users', 'catchers.user_id', 'users.id')
            .where('uid', uid)
            .first();
}

function getSubscribersAllocatedToCatcher(id) {
    return CatcherAllocation()
            .innerJoin('catchers', 'catcher_allocation.catcher_id', 'catchers.user_id')
            .innerJoin('users', 'catcher_allocation.subscriber_id', 'users.id')
            .innerJoin('subscribers', 'catcher_allocation.subscriber_id', 'subscribers.user_id')
            .where('catchers.user_id', id)
            .select('subscribers.subscriber_id as ref_id'
                ,'users.uid'
                ,'users.firstName'
                ,'users.lastName'
                ,'users.address'
                ,'users.city'
                ,'users.county'
                ,'users.postcode'
                ,'users.phone'
                ,'users.email');
}

function add(catcher, catcherIdPrefix) {  
    return knex.transaction(function (t) {
        return Users()
            .transacting(t)
            .insert(catcher, 'id')
            .then((id) => {
                return Catchers()
                    .transacting(t)
                    .insert({catcher_id: catcherIdPrefix + _.padStart(id[0], 6, '0'), user_id: id[0]}, 'catcher_id')
            })
            .then(t.commit)
            .catch(t.rollback)
    })
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
        return knex.transaction((t) => {
            return Users()
                .transacting(t)
                .where('email', catcher.email)
                .update(userObj)
                .then((id) => {
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
        return knex.transaction((t) => {
            return Users()
                .transacting(t)
                .where('email', catcher.email)
                .update(userObj)
                .then(t.commit)
                .catch(t.rollback)
        });
    }else if (!_.isEmpty(catcherObj)) {
        //Update Catchers table only
        return knex.transaction((t) => {
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
    return knex.transaction((t) => {
        return Catchers()
            .transacting(t)
            .del()
            .where('user_id', id)
            .then((response) => {
                return Users()
                    .transacting(t)
                    .del()
                    .where('id', id)
            })
            .then(t.commit)
            .catch(t.rollback)
    });
}

//TODO: This is not working as expected. Fix it!
function deleteByUid(uid) {
    return getByUid(uid)
        .then((catcher) => {
            deleteByUserId(catcher.id);
        });
}

module.exports = {
    getByEmail: getByEmail,
    getById: getById,
    getByUid: getByUid,
    add: add,
    deleteByUserId: deleteByUserId,
    deleteByUid: deleteByUid,
    update: update,
    getSubscribersAllocatedToCatcher: getSubscribersAllocatedToCatcher
};