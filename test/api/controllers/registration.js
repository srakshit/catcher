'use strict';

var should = require('should');
var request = require('supertest');
var server = require('../../../app');
var users = require('../../../db/users');
var catchers = require('../../../db/catchers');

describe('controllers', () => {
  describe('addCatcher', () => {
    describe('POST /catchers', () => {
      describe('happy path', () => {
        //Cleanup
        after(() => 
          users.getByEmail('test@test.com')
                .then((user) => catchers.deleteById(user.id))
                .then(() => users.deleteByEmail('test@test.com').then()));

        it('should add a catcher', (done) => {
          request(server)
            .post('/catchers')
            .send({
              'firstName': 'test',
              'lastName': 'test',
              'email': 'test@test.com',
              'phone': '07777777777',
              'address': 'test',
              'postcode': 'WA37HX'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
            .end((err, res) => {
              should.not.exist(err);
              res.body.message.should.eql('Catcher test test added!');
              done();
            });
        });
      });

      describe('error paths', () => {
        //Setup
        before(() => {
          users.add({
            'firstName': 'test',
            'lastName': 'test',
            'email': 'test@test.com',
            'phone': '07777777777',
            'address': 'test',
            'postcode': 'WA37HX'
          }).then();
        });

        //Teardown
        after(() => 
          users.getByEmail('test@test.com')
                .then((user) => catchers.deleteById(user.id))
                .then(() => users.deleteByEmail('test@test.com').then()));

        it('should throw error if phone is alphanumeric', (done) => {
          request(server)
            .post('/catchers')
            .send({
              'firstName': 'test',
              'lastName': 'test',
              'email': 'test@test.com',
              'phone': 'abcdefghijk',
              'address': 'test',
              'postcode': 'WA37HX'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end((err, res) => {
              should.not.exist(err);
              res.body.should.eql({ code: 'InvalidContent', message: 'phone number can\'t be alphanumeric!' });
              done();
            });
        });

        it('should throw error if catcher with same email exists', (done) => {
          request(server)
            .post('/catchers')
            .send({
              'firstName': 'test',
              'lastName': 'test',
              'email': 'test@test.com',
              'phone': '07777777778',
              'address': 'test',
              'postcode': 'WA37HX'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(409)
            .end((err, res) => {
              should.not.exist(err);
              res.body.should.eql({ code: 'Conflict', message: 'Catcher with same email exists!' });
              done();
            });
        });

        it('should throw error if catcher with same phone exists', (done) => {
          request(server)
            .post('/catchers')
            .send({
              'firstName': 'test',
              'lastName': 'test',
              'email': 'test1@test.com',
              'phone': '07777777777',
              'address': 'test',
              'postcode': 'WA37HX'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(409)
            .end((err, res) => {
              should.not.exist(err);
              res.body.should.eql({ code: 'Conflict', message: 'Catcher with same phone number exists!' });
              done();
            });
        });
      });
    });
  });
});
