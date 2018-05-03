'use strict';

let _ = require('lodash');
let conf = require('../config');

let prodConf = {
    cognitoDomain: 'https://catchernet-production.auth.us-west-2.amazoncognito.com'
};

module.exports = _.merge({}, conf, prodConf);