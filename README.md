# metro-transit-clone
A basic clone of the Metro Transit NexTrip web app bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started
To get started with development, run the following commands to install dependencies and start up a local dev server. Performance during development is not as good as a prod build because SSG requests are made every time. This is by design with Next.js.
```
$ git clone https://github.com/droobertzka/metro-transit-clone.git
$ npm install
$ npm run dev
```

## Testing
End-to-end tests use [Cypress.io](https://docs.cypress.io/)
```
# To open the interactive Cypress app:
$ npm run cy:open

# To run headless (captures videos):
$ npm test
```

## Production Build
After running a build, deploy the entire `.next` output folder into a Node server and run `npm start`.
```
$ npm run build
$ npm start
```

## Not Implemented
* Unit/component tests
* Cron job to update static build (i.e. API responses)?
* Better UX (e.g. skeleton / shimmer effect during loading)

## The Good
* Very fast to get up and running
* Much easier to organize and structure
* Far more scalable

## The Bad
* Overhead of learning Next.js
* Necessarily limited by opinionated framework

## Next.js Resources
* [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
* [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
