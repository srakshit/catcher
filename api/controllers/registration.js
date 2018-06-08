'use strict';

const errs = require('restify-errors');
const catchers = require('../../db/catchers');
const users = require('../../db/users');
const generate = require('nanoid/generate');

let uid = () => generate('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 22);

function addCatcher(req, res, next) {
    let catcher = req.swagger.params.catcher.value;
	catcher.type = 'C';

    if (new RegExp(/[a-zA-Z]/).test(catcher.phone)) {
        return next(new errs.InvalidContentError('phone number can\'t be alphanumeric!'));
    }

    catcher.postcode = catcher.postcode.replace(' ', '');
    catcher.uid = 'usr_' + uid();

    let catcherIdPrefix = 'C' + catcher.lastName.substr(0, 1).toUpperCase() + catcher.firstName.substr(0, 1).toUpperCase() + catcher.postcode.toUpperCase();

    catchers.add(catcher, catcherIdPrefix)
        .then((id) => {
            catchers.getById(id[0])
                .then((newCatcher) => {
                    res.send(201, {message: 'Catcher ' + catcher.firstName + ' ' + catcher.lastName + ' added!', id: id[0], uid: newCatcher.uid});
                    return next();
                });            
        })
        .catch((err) => {
            let errMsg = err.message.toLowerCase();
            if (new RegExp(/unique constraint/).test(errMsg)) {
                if (new RegExp(/users.email/).test(errMsg) || new RegExp(/users_email_unique/).test(err)) {
                    return next(new errs.ConflictError('User with same email exists!'));
                } 
                if (new RegExp(/users.phone/).test(errMsg) || new RegExp(/users_phone_unique/).test(err)) {
                    return next(new errs.ConflictError('User with same phone number exists!'));
                }
            }
            return next(new errs.InternalError(err.message, 'Failed to create catcher!'));
        });
}

function updateCatcher(req, res, next) {
    let catcher = req.swagger.params.catcher.value;

    if (catcher.postcode) {
        catcher.postcode = catcher.postcode.replace(' ', '');
    }

    if (catcher.phone && new RegExp(/[a-zA-Z]/).test(catcher.phone)) {
        return next(new errs.InvalidContentError('phone number can\'t be alphanumeric!'));
    }

    catchers.update(catcher)
        .then(() => {
            res.send(204);
            return next();
        })
        .catch((err) => {
            console.log(err);
            return next(new errs.InternalError(err.message, 'Failed to create catcher!'));
        });
}

function getCatcherById(req, res, next) {
    let id = req.swagger.params.uid.value;
    
    if (id.startsWith('usr_')) {
        catchers.getByUid(id)
            .then((catcher) => {
                if (catcher) {
                    delete catcher.id;
                    delete catcher.user_id;
                    res.send(200, catcher);
                    return next();
                }else {
                    return next(new errs.ResourceNotFoundError('No matching catcher found!'))
                }
            })
            .catch((err) => {
                //TODO: Test code path
                return next(new errs.InternalError(err.message, 'Failed to retrieve catcher!'));
            });
    }else {
        catchers.getById(id)
            .then((catcher) => {
                if (catcher) {
                    delete catcher.id;
                    delete catcher.user_id;
                    res.send(200, catcher);
                    return next();
                }else {
                    return next(new errs.ResourceNotFoundError('No matching catcher found!'))
                }
            })
            .catch((err) => {
                //TODO: Test code path
                return next(new errs.InternalError(err.message, 'Failed to retrieve catcher!'));
            });
    }
}

function getCatcherByEmail(req, res, next) {
    let email = req.swagger.params.email.value;
    
    catchers.getByEmail(email)
        .then((catcher) => {
            if (catcher) {
                res.send(200, catcher);
                return next();
            }else {
                return next(new errs.ResourceNotFoundError('No matching catcher found!'))
            }
        })
        .catch((err) => {
            //TODO: Test code path
            return next(new errs.InternalError(err.message, 'Failed to retrieve catcher!'));
        });
}

function getUserByEmail(req, res, next) {
    let email = req.swagger.params.email.value;
    
    users.getByEmail(email)
        .then((user) => {
            if (user) {
                res.send(200, user);
                return next();
            }else {
                return next(new errs.ResourceNotFoundError('No matching user found!'))
            }
        })
        .catch((err) => {
            //TODO: Test code path
            return next(new errs.InternalError(err.message, 'Failed to retrieve user!'));
        });
}

module.exports = {
    addCatcher: addCatcher,
    getCatcherById: getCatcherById,
    getCatcherByEmail: getCatcherByEmail,
    updateCatcher: updateCatcher,
    getUserByEmail: getUserByEmail
};