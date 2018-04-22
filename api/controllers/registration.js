'use strict';

var errs = require('restify-errors');
var catchers = require('../../db/catchers');

function addCatcher(req, res, next) {
    let catcher = req.swagger.params.catcher.value;
	catcher.type = 'C';

    if (new RegExp(/[a-zA-Z]/).test(catcher.phone)) {
        return next(new errs.InvalidContentError('phone number can\'t be alphanumeric!'));
    }

    let catcherIdPrefix = 'C' + catcher.lastName.substr(0, 1).toUpperCase() + catcher.firstName.substr(0, 1).toUpperCase() + catcher.postcode.toUpperCase();

    catchers.add(catcher, catcherIdPrefix)
        .then((id) => {
            res.send(201, {message: 'Catcher ' + catcher.firstName + ' ' + catcher.lastName + ' added!', id: id[0]});
            return next();
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
    let id = req.swagger.params.id.value;
    
    catchers.getById(id)
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

module.exports = {
    addCatcher: addCatcher,
    getCatcherById: getCatcherById,
    getCatcherByEmail: getCatcherByEmail,
    updateCatcher: updateCatcher
};