/* eslint prefer-arrow-callback: "off" */
/* eslint func-names: "off" */
/* eslint dot-notation: 0 */
import jsdom from 'jsdom';
import { assert } from 'chai';
import sinon from 'sinon';
import cheerio from 'cheerio';
import { FullStoryClient } from '../index';
import { FULLSTORY_CODE } from '../src/snippets/fullstory.js';

describe('FullStory Lib Tests', function () {
    // setup a fresh dom each time to keep our test state clean
    beforeEach(function () {
        global.document = jsdom.jsdom('<!doctype html><html><head></head><body></body></html>');
        global.window = document.parentWindow;
        global.navigator = { userAgent: 'node.js' };

        // need to simulate an external FS client for fullstory
        global.window.FS = {};

        global.window.FS.identify = function (id, data) {
            global.window.myTestId = id;
            global.window.myTestData = data;
        };

        global.window.FS.getSessionURL = function () {
            return `www.test-fullstory.com/${global.window.myTestId}`;
        };

        global.window.FS.simulateReady = function () {
            global.window['_fs_ready'].call();
        };
    });

    it('should inject global fullstory variables onto window', function () {
        const client = new FullStoryClient({
            debug: false,
            host: 'www.fullstory.com',
            orgKey: 'is-real'
        }, global.window);

        client.render();
        assert.equal(false, global.window['_fs_debug']);
        assert.equal('www.fullstory.com', global.window['_fs_host']);
        assert.equal('is-real', global.window['_fs_org']);
    });

    it('should inject the client code a script tag into the head', function () {
        const client = new FullStoryClient({
            debug: false,
            host: 'www.test-fullstory.com',
            orgKey: 'not-real'
        }, global.window);

        client.render();

        const $ = cheerio.load(global.window.document.documentElement.innerHTML);
        const actual = $('script').get(1).children[0].data;
        assert.equal(FULLSTORY_CODE, actual);
    });

    it('should inject the external client code based on url set', function () {
        const client = new FullStoryClient({
            debug: false,
            host: 'www.test-fullstory.com',
            orgKey: 'not-real'
        }, global.window);

        client.render();
        const $ = cheerio.load(global.window.document.documentElement.innerHTML);
        const actual = $('script').first().attr('src');
        assert.equal('https://www.test-fullstory.com/s/fs.js', actual);
    });

    it('should allow me to set a session and data', function () {
        const client = new FullStoryClient({
            debug: false,
            host: 'www.test-fullstory.com',
            orgKey: 'not-real'
        }, global.window);

        client.setSession('test1234', {});
        assert.equal('test1234', client.sessionId);
        assert.equal('test1234', global.window.myTestId);

        client.setSession('test1234', { foo: 'bar' });
        assert.deepEqual({ foo: 'bar' }, global.window.myTestData);
    });

    it('should allow me to get a sessionId', function () {
        const client = new FullStoryClient({
            debug: false,
            host: 'www.test-fullstory.com',
            orgKey: 'not-real'
        }, global.window);

        client.sessionId = 'test1234';
        assert.equal('test1234', client.getSession());
    });

    it('should allow me to get session callbacks', function () {
        const mock = function mockery() {};
        const client = new FullStoryClient({
            debug: false,
            host: 'www.test-fullstory.com',
            orgKey: 'not-real',
            sessionCallbacks: [mock]
        }, global.window);

        assert.deepEqual([mock], client.getSessionCallbacks());
    });

    it('should allow me to append new callbacks', function () {
        const mock = function mockery() {};
        const client = new FullStoryClient({
            debug: false,
            host: 'www.test-fullstory.com',
            orgKey: 'not-real',
            sessionCallbacks: [mock]
        }, global.window);

        client.onLoad(mock);
        assert.deepEqual([mock, mock], client.getSessionCallbacks());
    });

    it('should get a sessionURL after load', function (done) {
        const client = new FullStoryClient({
            debug: false,
            host: 'www.test-fullstory.com',
            orgKey: 'not-real'
        }, global.window);

        client.setSession('test1234');
        global.window.FS.simulateReady();
        client.getSessionUrl(function (url) {
            assert.equal('www.test-fullstory.com/test1234', url);
            done();
        });
    });

    it('should not get a session url if not loaded', function (done) {
        const spy = sinon.spy();
        const client = new FullStoryClient({
            debug: false,
            host: 'www.test-fullstory.com',
            orgKey: 'not-real'
        }, global.window);

        client.setSession('test1234');
        client.getSessionUrl(spy);

        assert(spy.notCalled);
        done();
    });

    it('isLoaded return true / false when fullstory is done registering', function () {
        const spy = sinon.spy();
        const client = new FullStoryClient({
            debug: false,
            host: 'www.test-fullstory.com',
            orgKey: 'not-real',
            sessionCallbacks: [
                spy
            ]
        }, global.window);

        assert.isFalse(client.isLoaded());

        // simulate the FS client as being in a ready state
        global.window.FS.simulateReady();
        assert.isTrue(client.isLoaded());
    });

    it('onLoad will call my callback 1 time', function () {
        const spy = sinon.spy();
        const client = new FullStoryClient({
            debug: false,
            host: 'www.test-fullstory.com',
            orgKey: 'not-real'
        }, global.window);

        client.onLoad(spy);
        global.window.FS.simulateReady();
        assert(spy.calledOnce);
    });
});
