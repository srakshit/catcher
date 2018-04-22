'use strict';

var should = require('should');
var request = require('supertest');
var server = require('../../../app');
var catchers = require('../../../db/catchers');

describe('controllers', () => {
    describe('GET /catchers', () => {
        //Cleanup
        afterEach(() => 
            catchers.getByEmail('test@test.com')
                .then((catcher) => catchers.deleteByUserId(catcher.id).then()));

        describe('happy path', () => {
            it('should get a catcher', (done) => {
                catchers.add({
                    'firstName': 'test',
                    'lastName': 'test',
                    'email': 'test@test.com',
                    'phone': '07777777777',
                    'address': 'test',
                    'postcode': 'WA37HX',
                    'type': 'S'
                }, 'TT7HX').then((id) => {

                    request(server)
                        .get('/api/v1/catchers/' + id[0])
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(200)
                        .end((err, res) => {
                            should.not.exist(err);
                            res.body.firstName.should.eql('test');
                            res.body.lastName.should.eql('test');
                            res.body.email.should.eql('test@test.com');
                            res.body.phone.should.eql('07777777777');
                            res.body.address.should.eql('test');
                            res.body.postcode.should.eql('WA37HX');
                            done();
                        });
                });
            });
        });

        describe('error paths', () => {
            it('should throw NotFound error when catcher is not found', (done) => {
                catchers.add({
                    'firstName': 'test',
                    'lastName': 'test',
                    'email': 'test@test.com',
                    'phone': '07777777777',
                    'address': 'test',
                    'postcode': 'WA37HX',
                    'type': 'S'
                }, 'TT7HX').then((id) => {

                    request(server)
                        .get('/api/v1/catchers/' + id[0]+'1')
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(404)
                        .end((err, res) => {
                            should.not.exist(err);
                            res.body.should.eql({ code: 'ResourceNotFound', message: 'No matching catcher found!' });
                            done();
                        });
                });
            });
        });
    });

    describe('GET /catchers/email', () => {
        //Cleanup
        afterEach(() => 
            catchers.getByEmail('test@test.com')
                .then((catcher) => catchers.deleteByUserId(catcher.id).then()));

        describe('happy path', () => {
            it('should get a catcher', (done) => {
                catchers.add({
                    'firstName': 'test',
                    'lastName': 'test',
                    'email': 'test@test.com',
                    'phone': '07777777777',
                    'address': 'test',
                    'postcode': 'WA37HX',
                    'type': 'S'
                }, 'TT7HX').then((id) => {

                    request(server)
                        .get('/api/v1/catchers/email/test@test.com')
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(200)
                        .end((err, res) => {
                            should.not.exist(err);
                            res.body.firstName.should.eql('test');
                            res.body.lastName.should.eql('test');
                            res.body.email.should.eql('test@test.com');
                            res.body.phone.should.eql('07777777777');
                            res.body.address.should.eql('test');
                            res.body.postcode.should.eql('WA37HX');
                            done();
                        });
                });
            });
        });

        describe('error paths', () => {
            it('should throw NotFound error when catcher is not found', (done) => {
                catchers.add({
                    'firstName': 'test',
                    'lastName': 'test',
                    'email': 'test@test.com',
                    'phone': '07777777777',
                    'address': 'test',
                    'postcode': 'WA37HX',
                    'type': 'S'
                }, 'TT7HX').then((id) => {

                    request(server)
                        .get('/api/v1/catchers/' + id[0]+'1')
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(404)
                        .end((err, res) => {
                            should.not.exist(err);
                            res.body.should.eql({ code: 'ResourceNotFound', message: 'No matching catcher found!' });
                            done();
                        });
                });
            });
        });
    });

    describe('POST /catchers', () => {
        //Cleanup
        afterEach(() => 
            catchers.getByEmail('test@test.com')
                .then((catcher) => catchers.deleteByUserId(catcher.id).then()));

        describe('happy path', () => {
            it('should add a catcher', (done) => {
                request(server)
                    .post('/api/v1/catchers')
                    .send({
                        'firstName': 'test',
                        'lastName': 'test',
                        'email': 'test@test.com',
                        'phone': '07777777777',
                        'address': 'test',
                        'postcode': 'WA37HX',
                        'type': 'S'
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
            beforeEach(() => {
                catchers.add({
                    'firstName': 'test',
                    'lastName': 'test',
                    'email': 'test@test.com',
                    'phone': '07777777777',
                    'address': 'test',
                    'postcode': 'WA37HX',
                    'type': 'S'
                }).then();
            });

            it('should throw InvalidContent error if phone is alphanumeric', (done) => {
                request(server)
                    .post('/api/v1/catchers')
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

            it('should throw Conflict error if user with same email exists', (done) => {
                request(server)
                    .post('/api/v1/catchers')
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
                        res.body.should.eql({ code: 'Conflict', message: 'User with same email exists!' });
                        done();
                    });
            });

            it('should throw Conflict error if user with same phone exists', (done) => {
                request(server)
                    .post('/api/v1/catchers')
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
                        res.body.should.eql({ code: 'Conflict', message: 'User with same phone number exists!' });
                        done();
                    });
            });
        });
    });
});
