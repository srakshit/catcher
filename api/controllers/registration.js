'use strict';

var errs = require('restify-errors');
var catchers = require('../../db/catchers');

module.exports = {
    addCatcher: addCatcher
};

function addCatcher(req, res, next) {
    let catcher = req.swagger.params.Catcher.value;

    if (new RegExp(/[a-zA-Z]/).test(catcher.phone)) {
        return next(new errs.InvalidContentError('phone number can\'t be alphanumeric!'));
    }

    catchers.add(catcher)
        .then(() => {
            res.send(201, {message: 'Catcher ' + catcher.name + ' added!'});
            return next();
        })
        .catch((err) => {
            let errMsg = err.message.toLowerCase();
            if (new RegExp(/unique constraint/).test(errMsg)) {
                if (new RegExp(/catchers.email/).test(errMsg) || new RegExp(/catchers_email_unique/).test(err)) {
                    return next(new errs.ConflictError('Catcher with same email exists!'));
                } 
                if (new RegExp(/catchers.phone/).test(errMsg) || new RegExp(/catchers_phone_unique/).test(err)) {
                    return next(new errs.ConflictError('Catcher with same phone number exists!'));
                }
            }
            return next(new errs.InternalServerError(err.message, 'Failed to create catcher!'));
        });
}