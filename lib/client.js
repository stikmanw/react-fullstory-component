'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* eslint dot-notation: 0 */


var _fullstory = require('./snippets/fullstory');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Inject a script tag into the head of the document.
 * @param DOMObject document
 * @param string code to render in the script tag
 */
function insertSnippet(document, code) {
    var scriptTag = document.createElement('script');
    scriptTag.innerHTML = code;

    // we should have a head in the html...but if we don't I guess the bottom of the body will do
    if (document.head) {
        document.head.appendChild(scriptTag);
    } else {
        document.body.appendChild(scriptTag);
    }
}

/**
 * Attach to the event fired by the FullStory client when the session has been registed on
 * the remote server
 * @param fullstoryClient
 */
function setWatcher(client) {
    var localClient = client;
    localClient.window['_fs_ready'] = function localFSLoad() {
        localClient.nowLoaded();
    };
}

/**
 * Register the list of globals on the window object for fullstory
 * @param object window
 * @param object settings
 */
function registerGlobals(settings, window) {
    var windowRef = window;

    windowRef['_fs_debug'] = settings.debug || false;
    windowRef['_fs_host'] = settings.host || 'www.fullstory.com';
    windowRef['_fs_org'] = settings.orgKey || null;
    windowRef['_fs_run_in_iframe'] = settings.iframe || false;
    windowRef['_fs_is_outer_script'] = settings.iframeOnly || false;
}

/**
 * generate the script initalize script from full story documentation page
 * @link https://www.fullstory.com/ui/[org-key]/settings/tracking
 * @param object settings
 *
 * @example initScript({
 *    debug: false,
 *    host: 'www.fullstory.com',
 *    orgKey: 'myorgkey',
 *    iframe: false  // Iframe should be used for iframes not within same domain to correct for CORS
 * });
 */

var fullstoryClient = function () {
    function fullstoryClient(settings, window) {
        _classCallCheck(this, fullstoryClient);

        this.window = window;
        this.settings = settings || {};
        this.loaded = false;
        this.sessionCallbacks = settings.sessionCallbacks ? settings.sessionCallbacks : [];

        if (typeof this.settings.orgKey !== 'string') {
            throw new TypeError('"setting.orgKey must be a valid string organization key');
        }

        registerGlobals(settings, window);
        setWatcher(this);
    }

    /**
     * This renders the js code to the page
     */


    _createClass(fullstoryClient, [{
        key: 'render',
        value: function render() {
            insertSnippet(this.window.document, _fullstory.FULLSTORY_CODE);
        }

        /**
         * called when the fullstory external client determines the session is available for retrieval
         * if we have callbacks waiton on urls fire them off
         */

    }, {
        key: 'nowLoaded',
        value: function nowLoaded() {
            this.loaded = true;

            for (var i = 0; i < this.sessionCallbacks.length; i++) {
                this.getSessionUrl(this.sessionCallbacks[i]);
            }
        }

        /**
         * Is the session url loaded
         */

    }, {
        key: 'isLoaded',
        value: function isLoaded() {
            return this.loaded;
        }
    }, {
        key: 'onLoad',
        value: function onLoad(callback) {
            this.sessionCallbacks.push(callback);
        }
    }, {
        key: 'getSessionCallbacks',
        value: function getSessionCallbacks() {
            return this.sessionCallbacks;
        }

        /**
         * Set a user session for the current loaded instance of fullstory
         */

    }, {
        key: 'setSession',
        value: function setSession(sessionId, data) {
            this.sessionId = sessionId;
            this.window.FS.identify(this.sessionId, data);
        }

        /**
         * get the active sessionId that is set for fullstory
         */

    }, {
        key: 'getSession',
        value: function getSession() {
            return this.sessionId;
        }

        /**
         * This clears the browser cookie session for the user
         */

    }, {
        key: 'clearUserSession',
        value: function clearUserSession() {
            if (this.window && this.window.FS && this.window.FS.clearUserCookie) {
                this.window.FS.clearUserCookie();
            }
        }

        /**
         * Ask for the session url when it becomes available.
         */

    }, {
        key: 'getSessionUrl',
        value: function getSessionUrl(callback) {
            if (this.isLoaded()) {
                callback(this.window.FS.getSessionURL());
            } else {
                this.sessionCallbacks.push(callback);
            }
        }
    }]);

    return fullstoryClient;
}();

exports.default = fullstoryClient;