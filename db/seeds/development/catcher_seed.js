'use strict';

exports.seed = (knex) => {
  return knex('catchers').del()
    .then(function () {
      return knex('catchers').insert([
        {id: 1, name: 'Subham Rakshit', email: 'subham@catcher.net', phone: '01234567890', address: 'Warrington', postcode: 'WA3 7PB'},
        {id: 2, name: 'Nigel Johnson', email: 'nigel@catcher.net', phone: '09838483838', address: 'Appleton', postcode: 'WA5 7PB'},
      ]);
    });
};
