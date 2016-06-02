import React, { Component, PropTypes, warning } from 'react';
import FullStoryClient from '../client';

/**
 * This is a react component that will inject the necessary code into a page for tracking via
 */
class FullStory extends React.Component {

    /**
     * On mount we will inject our javacript settings based on the settings we have in the
     * system.
     */
    componentDidMount() {
        // initialize the fullstory client not the need to use a global variable here yuck
        this.fullStoryClient = new FullStoryClient(this.props.settings, window);

        if(typeof window.FS === 'undefined') {
            this.fullStoryClient.render();
        }

        // set out initial session based on the props passed in
        this.fullStoryClient.setSession(this.props.sessionId, this.props.custom);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(nextProps.sessionId !== this.props.sessionId) {
            this.fullStoryClient.clearUserSession();
            this.fullStoryClient.setSessionId(nextProps.sessionId, nextProps.custom);
        }
    }

    render() {
		return (
           <div className="fullstory"/>
        );
    }
}

FullStory.PropTypes = {
   settings: PropTypes.shape({
       debug: PropTypes.bool,
       host: PropTypes.string,
       orgKey: PropTypes.string,
       iframe: PropTypes.bool
   }),
   sessionId: PropTypes.string,
   custom: PropTypes.object
};

FullStory.defaultProps = {
    settings: {
        debug: false,
        host: 'www.fullstory.com',
        orgKey: null,
        iframe: false
    },
    sessionId: null,
    custom: {}
}

export default FullStory;
