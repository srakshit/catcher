'use strict';

const _ = require('lodash');
const moment = require('moment');
const knex = require('../../db/knex.js');

function Users() {
    return knex('users');
}

function Subscribers() {
    return knex('subscribers');
}

function Catchers() {
    return knex('catchers');
}

function CatcherAllocation() {
    return knex('catcher_allocation');
}

function getByEmail(email) {
    return Subscribers()
            .innerJoin('users', 'subscribers.user_id', 'users.id')
            .where('email', email)
            .first();
}

function add(subscriber, subscriberIdPrefix) {  
    return knex.transaction((t) => {
        return Users()
            .transacting(t)
            .insert(subscriber, 'id')
            .then((id) => {
                return Subscribers()
                    .transacting(t)
                    .insert({subscriber_id: subscriberIdPrefix + _.padStart(id[0], 6, '0'), user_id: id[0]}, 'subscriber_id')
            })
            .then(t.commit)
            .catch(t.rollback);
    });
}

function deleteByUserId(id) {
    return knex.transaction((t) => {
        return CatcherAllocation()
            .transacting(t)
            .del()
            .where('subscriber_id', id)
            .then((response) => {
                return Subscribers()
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
            })
            .then(t.commit)
            .catch(t.rollback)
        
    });
}

function allocateCatcher(catcher_id, subscriber_id) {
    return CatcherAllocation()
            .insert({catcher_id: catcher_id, subscriber_id: subscriber_id});
}

module.exports = {
    getByEmail: getByEmail,
    add: add,
    deleteByUserId: deleteByUserId,
    allocateCatcher: allocateCatcher
};