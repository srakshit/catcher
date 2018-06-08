'use strict';

const errs = require('restify-errors');
const catchers = require('../../db/catchers');


function getSubscribersAllocatedToCatcher(req, res, next) {
    let uid = req.swagger.params.uid.value;
    
    catchers.getSubscribersAllocatedToCatcher(uid)
            .then((allocatedSubscribers) => {
                if (allocatedSubscribers) {
                    res.send(200, allocatedSubscribers);
                    return next();
                }else {
                    return next(new errs.ResourceNotFoundError('No subscriber is allocated to the catcher!'))
                }
            })
            .catch((err) => {
                //TODO: Test code path
                return next(new errs.InternalError(err.message, 'Failed to retrieve subscriber allocation to catcher'));
            });
}

module.exports = {
    getSubscribersAllocatedToCatcher: getSubscribersAllocatedToCatcher
};