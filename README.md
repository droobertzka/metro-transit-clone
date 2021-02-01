# metro-transit-clone
A basic clone of the Metro Transit NexTrip web app.

## Getting Started
To get started with development, run the following commands to install dependencies and start up a local dev server. A proxy is configured to reroute `/nextripv2` requests to the Metro Transit API.
```
$ git clone https://github.com/droobertzka/metro-transit-clone.git
$ npm install
$ npm start
```

## Testing
Unit tests use [jest](https://jestjs.io/)
```
$ npm test
```

## Build
[Webpack](https://webpack.js.org/concepts/) is used for both a development server (with source maps) and a production build. Deployable, static asset output is placed into a `dist` folder.
```
$ npm run build
```

## Not Implemented
* Server: this is only the front end, and assumes it will be deployed to a server which will serve the static files and pass api requests through to the Metro Transit API (and back)
* Full fledged routing: direct navigation to anywhere other than the index will not work

## The Good
* None of the overhead (e.g. maintenance, learning, bundle size) of a framework
* Breaking out of the framework box is novel/fun
* Getting back to basics and reimmersing in native browser tech
* Demonstrates competencies in core libraries like webpack and jest

## The Bad
* Interacting with the DOM natively presents unique challenges:
    * Code is difficult to organize compared to frameworks with components
    * Difficult to test
* If scaled up, a framework would eventually be needed anyway