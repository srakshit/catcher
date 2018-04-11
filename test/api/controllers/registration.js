'use strict';

var should = require('should');
var request = require('supertest');
var server = require('../../../app');
var catchers = require('../../../db/catchers');

describe('controllers', () => {
  describe('addCatcher', () => {
    describe('POST /catchers', () => {
      describe('happy path', () => {
        //Cleanup
        after(() => catchers.deleteByPhone('07777777777').then());

        it('should add a catcher', (done) => {
          request(server)
            .post('/catchers')
            .send({
              'name': 'test',
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
              res.body.should.eql({message: 'Catcher test added!'});
              done();
            });
        });
      });

      describe('error paths', () => {
        //Setup
        before(() => {
          catchers.add({
            'name': 'test',
            'email': 'test@test.com',
            'phone': '07777777777',
            'address': 'test',
            'postcode': 'WA37HX'
          }).then();
        });

        //Teardown
        after(() => catchers.deleteByPhone('07777777777').then());

        it('should throw error if phone is alphanumeric', (done) => {
          request(server)
            .post('/catchers')
            .send({
              'name': 'test',
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
              'name': 'test',
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
              'name': 'test',
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
