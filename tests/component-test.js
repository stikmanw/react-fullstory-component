/* eslint prefer-arrow-callback: "off" */
/* eslint func-names: "off" */
import jsdom from 'jsdom';
import { assert } from 'chai';
import React from 'react';
import { shallow, mount, render } from 'enzyme';
import cheerio from 'enzyme/node_modules/cheerio';
import FullStory from '../src/component/fullstory';

describe('<Fullstory /> Component Tests', function() {
    beforeEach(function () {
        global.document = jsdom.jsdom('<!doctype html><html><head></head><body></body></html>');
        global.window = document.parentWindow;
        global.navigator = { userAgent: 'node.js' };
    });

    it('should throw an error if the organization key is not set', function() {
        assert.throws(function() {
             mount(<FullStory />);
        }, TypeError);
    });

    it('should allow prop:settings', function () {
        const wrapper = mount(<FullStory settings={{ debug: true, orgKey: '1234' }} />);
        assert.deepEqual({ debug: true, orgKey: '1234' }, wrapper.props().settings);
    });

    it('should allow props:sessionId', function () {
        const wrapper = mount(<FullStory sessionId='1234' settings={{ orgKey: '1234' }} />);
        assert.equal('1234', wrapper.props().sessionId);
    });

    it('should allow props:custom', function () {
        const wrapper = mount(<FullStory settings={{ orgKey: '1234' }} custom={{ foo: 'bar' }} />);
        assert.deepEqual({ foo: 'bar' }, wrapper.props().custom);
    });

    it('should display a div tag', function () {
        const wrapper = shallow(<FullStory settings={{ orgKey: '1234' }} custom={{ foo: 'bar' }} sessionId='1234test' />);
        assert.isTrue(wrapper.contains(<div className="fullstory"></div>));
    });

});
