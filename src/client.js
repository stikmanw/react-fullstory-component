/* eslint dot-notation: 0 */
import { FULLSTORY_CODE } from './snippets/fullstory';

/**
 * Inject a script tag into the head of the document.
 * @param DOMObject document
 * @param string code to render in the script tag
 */
function insertSnippet(document, code) {
    const scriptTag = document.createElement('script');
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
    const localClient = client;
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
    const windowRef = window;
    windowRef['_fs_debug'] = settings.debug;
    windowRef['_fs_host'] = settings.host;
    windowRef['_fs_org'] = settings.orgKey;
    windowRef['_fs_run_in_iframe'] = settings.iframe;
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
export default class fullstoryClient {

    constructor(settings, window) {
        this.window = window;
        this.settings = settings || {};
        this.loaded = false;
        this.sessionCallbacks = (settings.sessionCallbacks) ? settings.sessionCallbacks : [];

        if (typeof this.settings.orgKey !== 'string') {
            throw new TypeError('"setting.orgKey must be a valid string organization key');
        }

        registerGlobals(settings, window);
        setWatcher(this);
    }

    /**
     * This renders the js code to the page
     */
    render() {
        insertSnippet(this.window.document, FULLSTORY_CODE);
    }

    /**
     * called when the fullstory external client determines the session is available for retrieval
     * if we have callbacks waiton on urls fire them off
     */
    nowLoaded() {
        this.loaded = true;

        for (let i = 0; i < this.sessionCallbacks.length; i++) {
            this.getSessionUrl(this.sessionCallbacks[i]);
        }
    }

    /**
     * Is the session url loaded
     */
    isLoaded() {
        return this.loaded;
    }

    onLoad(callback) {
        this.sessionCallbacks.push(callback);
    }

    getSessionCallbacks() {
        return this.sessionCallbacks;
    }

    /**
     * Set a user session for the current loaded instance of fullstory
     */
    setSession(sessionId, data) {
        this.sessionId = sessionId;
        this.window.FS.identify(this.sessionId, data);
    }

    /**
     * get the active sessionId that is set for fullstory
     */
    getSession() {
        return this.sessionId;
    }

    /**
     * This clears the browser cookie session for the user
     */
    clearUserSession() {
        this.window.FS.clearUserCookie();
    }

    /**
     * Ask for the session url when it becomes available.
     */
    getSessionUrl(callback) {
        if (this.isLoaded()) {
            callback(this.window.FS.getSessionURL());
        } else {
            this.sessionCallbacks.push(callback);
        }
    }
}
