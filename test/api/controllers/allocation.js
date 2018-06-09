'use strict';

const should = require('should');
const request = require('supertest');
const server = require('../../../app');
const subscribers = require('../../db/subscribers');
const catchers = require('../../../db/catchers');
const generate = require('nanoid/generate');

let uid = () => generate('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 22);

describe('controllers', () => {
    describe('GET /catchers/{uid}/subscribers/', () => {
        //Setup
        beforeEach((done) => {
            subscribers.add({
                'firstName': 'test',
                'lastName': 'test',
                'email': 'subscriber@test.com',
                'phone': '07777777777',
                'uid': 'usr_' + uid(),
                'address': 'test',
                'city': 'test',
                'county': 'test',
                'postcode': 'WA37HX',
                'type': 'S'
            }, 'S').then(() => {
                catchers.add({
                    'firstName': 'test',
                    'lastName': 'test',
                    'email': 'catcher@test.com',
                    'phone': '07777777778',
                    'uid': 'usr_' + uid(),
                    'address': 'test',
                    'city': 'test',
                    'county': 'test',
                    'postcode': 'WA37HX',
                    'type': 'C'
                }, 'C').then(() => done());
            });
        });
        
        //Cleanup
        afterEach((done) => {
            subscribers.getByEmail('subscriber@test.com')
                .then((subscriber) => {
                    subscribers.deleteByUserId(subscriber.id)
                        .then(() => {
                            catchers.getByEmail('catcher@test.com')
                            .then((catcher) => {
                                catchers.deleteByUserId(catcher.id).then(() => done());
                            });
                        });
                });
        });

        describe('happy path', () => {
            it('should retrieve subscriber allocation of catcher', (done) => {
                subscribers.getByEmail('subscriber@test.com')
                    .then((subscriber) => {
                        catchers.getByEmail('catcher@test.com')
                            .then((catcher) => {
                                subscribers.allocateCatcher(catcher.id,subscriber.id)
                                    .then(() => {
                                        
                                        catchers.getByEmail('catcher@test.com')
                                            .then((catcher) => {
                                                request(server)
                                                    .get('/api/v1/catchers/' + catcher.uid + '/subscribers')
                                                    .set('Accept', 'application/json')
                                                    .expect('Content-Type', /json/)
                                                    .expect(200)
                                                    .end((err, res) => {
                                                        should.not.exist(err);
                                                        res.body[0].firstName.should.eql('test');
                                                        res.body[0].lastName.should.eql('test');
                                                        res.body[0].email.should.eql('subscriber@test.com');
                                                        res.body[0].phone.should.eql('07777777777');
                                                        res.body[0].address.should.eql('test');
                                                        res.body[0].city.should.eql('test');
                                                        res.body[0].county.should.eql('test');
                                                        res.body[0].postcode.should.eql('WA37HX');
                                                        done();
                                                    });
                                            });
                                    });
                            });
                    });
            });
        });

        describe('error paths', () => {
            it('should throw ResourceNotFound error when no subscriber is allocated to catcher', (done) => {
                catchers.getByEmail('catcher@test.com')
                    .then((catcher) => {
                        request(server)
                            .get('/api/v1/catchers/' + catcher.uid + '/subscribers')
                            .set('Accept', 'application/json')
                            .expect('Content-Type', /json/)
                            .expect(404)
                            .end((err, res) => {
                                should.not.exist(err);
                                res.body.message.should.eql('No subscriber is allocated to the catcher!');
                                done();
                            });
                    });
            });
        });
    });
});