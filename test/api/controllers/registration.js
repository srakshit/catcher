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
                    'city': 'test',
                    'county': 'test',
                    'postcode': 'WA37HX',
                    'type': 'C'
                }, 'CTT7HX').then((id) => {

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
                    'city': 'test',
                    'county': 'test',
                    'postcode': 'WA37HX',
                    'type': 'C'
                }, 'CTT7HX').then((id) => {

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
                    'city': 'test',
                    'county': 'test',
                    'postcode': 'WA37HX',
                    'type': 'C'
                }, 'CTT7HX').then((id) => {

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
                            res.body.city.should.eql('test');
                            res.body.county.should.eql('test');
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
                    'city': 'test',
                    'county': 'test',
                    'postcode': 'WA37HX',
                    'type': 'C'
                }, 'CTT7HX').then((id) => {

                    request(server)
                        .get('/api/v1/catchers/email/test1@test.com')
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
                        'city': 'test',
                        'county': 'test',
                        'postcode': 'WA3 7HX',
                        'type': 'C'
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
                    'city': 'test',
                    'county': 'test',
                    'postcode': 'WA37HX',
                    'type': 'C'
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
                        'city': 'test',
                        'county': 'test',
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
                        'city': 'test',
                        'county': 'test',
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
                        'city': 'test',
                        'county': 'test',
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

    describe('PUT /catchers', () => {
        //Cleanup
        afterEach(() => 
            catchers.getByEmail('test@test.com')
                .then((catcher) => catchers.deleteByUserId(catcher.id).then()));

        describe('happy path', () => {
            it('should update a catcher when all fields are provided', (done) => {
                catchers.add({
                    'firstName': 'test',
                    'lastName': 'test',
                    'email': 'test@test.com',
                    'phone': '07777777777',
                    'address': 'test',
                    'city': 'test',
                    'county': 'test',
                    'postcode': 'WA37HX',
                    'type': 'C'
                }, 'CTT7HX').then((id) => {
                    request(server)
                        .put('/api/v1/catchers')
                        .send({
                            'id': id[0],
                            'firstName': 'test1',
                            'lastName': 'test1',
                            'email': 'test@test.com',
                            'phone': '07777777778',
                            'address': 'test1',
                            'city': 'test1',
                            'county': 'test1',
                            'postcode': 'WA2 7GA',
                            'isActive' : false
                        })
                        .set('Accept', 'application/json')
                        .expect(204)
                        .end((err, res) => {
                            should.not.exist(err);
                            catchers.getByEmail('test@test.com')
                                    .then((catcher) => {
                                        catcher.firstName.should.eql('test1');
                                        catcher.lastName.should.eql('test1');
                                        catcher.phone.should.eql('07777777778');
                                        catcher.address.should.eql('test1');
                                        catcher.city.should.eql('test1');
                                        catcher.county.should.eql('test1');
                                        catcher.postcode.should.eql('WA27GA');
                                        catcher.isActive.should.eql(false);
                                        done();
                                    })
                        });

                });
            });

            it('should update a catcher when few personal detail fields are upadted', (done) => {
                catchers.add({
                    'firstName': 'test',
                    'lastName': 'test',
                    'email': 'test@test.com',
                    'phone': '07777777777',
                    'address': 'test',
                    'city': 'test',
                    'county': 'test',
                    'postcode': 'WA37HX',
                    'type': 'C'
                }, 'CTT7HX').then((id) => {
                    request(server)
                        .put('/api/v1/catchers')
                        .send({
                            'id': id[0],
                            'email': 'test@test.com',
                            'address': 'test1',
                            'city': 'test1',
                            'county': 'test1',
                            'postcode': 'WA27GA'
                        })
                        .set('Accept', 'application/json')
                        .expect(204)
                        .end((err, res) => {
                            should.not.exist(err);
                            catchers.getByEmail('test@test.com')
                                    .then((catcher) => {
                                        catcher.firstName.should.eql('test');
                                        catcher.address.should.eql('test1');
                                        catcher.city.should.eql('test1');
                                        catcher.county.should.eql('test1');
                                        catcher.postcode.should.eql('WA27GA');
                                        done();
                                    })
                        });

                });
            });

            it('should update a catcher when only status field is updated', (done) => {
                catchers.add({
                    'firstName': 'test',
                    'lastName': 'test',
                    'email': 'test@test.com',
                    'phone': '07777777777',
                    'address': 'test',
                    'city': 'test',
                    'county': 'test',
                    'postcode': 'WA37HX',
                    'type': 'C'
                }, 'CTT7HX').then((id) => {
                    request(server)
                        .put('/api/v1/catchers')
                        .send({
                            'id': id[0],
                            'email': 'test@test.com',
                            'isActive': false
                        })
                        .set('Accept', 'application/json')
                        .expect(204)
                        .end((err, res) => {
                            should.not.exist(err);
                            catchers.getByEmail('test@test.com')
                                    .then((catcher) => {
                                        catcher.firstName.should.eql('test');
                                        catcher.isActive.should.eql(false);
                                        done();
                                    })
                        });

                });
            });
        });
    });
});
