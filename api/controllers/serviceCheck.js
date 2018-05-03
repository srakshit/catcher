'use strict';

var errs = require('restify-errors');
var request = require('request');
var config = require('../../config');

function getPong(req, res, next) {
    res.send(200, {message: 'pong'});
    return next();
}

function confirmUser(req, res, next) {
    let clientId = req.swagger.params.clientId.value;
    let userName = req.swagger.params.userName.value;
    let confirmationCode = req.swagger.params.confirmationCode.value;
    let redirectUrl = req.swagger.params.redirectUrl.value;
    let url = config.cognitoDomain+'/confirmUser?client_id='+clientId+'&user_name='+userName+'&confirmation_code='+confirmationCode;

    request.get(url, (err, response, body) => {
        console.log(res);
        if (err) {
            return next(new errs.UnauthorizedError('Email verification failed'));
        }
        if (response.statusCode === 200) {
            res.header('Location', redirectUrl);
            res.send(302, {message: 'Email verified'});
            return next();
        }
    });
}

module.exports = {
    getPong: getPong,
    confirmUser: confirmUser
};