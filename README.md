## Synopsis [![Build Status](https://travis-ci.org/stikmanw/react-fullstory-component.svg?branch=master)](https://travis-ci.org/stikmanw/react-fullstory-component)

This is a ReactJS Component and library that is used bring [FullStory](https://fullstory.com/) into your webpage.

## Motivation

I built this to make it easy to integrate FullStory services into a ReactJS based application.

## Installation
```
npm install react-fullstory-component
```

## Component Code Examples
#### Basic Example
```javascript
const settings = {
    debug: false,
    host: 'www.fullstory.com',
    orgKey: 'fake'
};
const data = {
    key: value
};

const sessionId = '123456789';
const jsx = <FullStory settings={settings} sessionId={sessionId} custom={data} />;
```

#### IFrame Example
This is an example for FullStory for an iframe that is not in the same domain as the parent
```javascript
const settings = {
    host: 'www.fullstory.com',
    orgKey: 'fake',
    iframe: true
};
const sessionId = '123456789';
const jsx = <FullStory settings={settings} sessionId={sessionId} />;
```

## API Reference
IF you want to just use the wrapper library around used by the component, the following describes the exposed api and how to leverage it.

```javascript
```

## Tests
There are two scripts to run test
```
npm run test
npm run test-watch
```

* Requires Node Version 4+ to run tests.

## License
MIT
