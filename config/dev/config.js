'use strict';

let _ = require('lodash');
let conf = require('../config');

let devConf = {
    cognitoDomain: 'https://catchernet-dev.auth.us-west-2.amazoncognito.com'
};

module.exports = _.merge({}, conf, devConf);