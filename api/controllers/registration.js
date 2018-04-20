'use strict';

var errs = require('restify-errors');
var catchers = require('../../db/catchers');
var users = require('../../db/users');

module.exports = {
    addCatcher: addCatcher
};

function addCatcher(req, res, next) {
    let user = req.swagger.params.Catcher.value;

    if (new RegExp(/[a-zA-Z]/).test(user.phone)) {
        return next(new errs.InvalidContentError('phone number can\'t be alphanumeric!'));
    }

    users.add(user)
        .then((id) => {
            let catcher = {
                user_id: parseInt(id),
                catcher_id: 'CATCHER_'+id
            };
            
            catchers.add(catcher)
                    .then((id) => {
                        res.send(201, {message: 'Catcher ' + user.firstName + ' ' + user.lastName + ' added!', id: id[0]});
                        return next();
                    })
                    .catch((err) => {
                        //TODO: Test this flow
                        let errMsg = err.message.toLowerCase();
                        users.deleteByEmail(user.email).then();
                        return next(new errs.InternalServerError(err.message, 'Failed to create catcher!'));
                    });
            
        })
        .catch((err) => {
            let errMsg = err.message.toLowerCase();
            if (new RegExp(/unique constraint/).test(errMsg)) {
                if (new RegExp(/users.email/).test(errMsg) || new RegExp(/users_email_unique/).test(err)) {
                    return next(new errs.ConflictError('Catcher with same email exists!'));
                } 
                if (new RegExp(/users.phone/).test(errMsg) || new RegExp(/users_phone_unique/).test(err)) {
                    return next(new errs.ConflictError('Catcher with same phone number exists!'));
                }
            }
            return next(new errs.InternalServerError(err.message, 'Failed to create catcher!'));
        });
}