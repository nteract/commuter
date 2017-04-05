[![Heroku](https://heroku-badge.herokuapp.com/?app=nteract-commuter&svg=1)](https://nteract-commuter.herokuapp.com/)
[![Build Status](https://travis-ci.org/nteract/commuter.svg?branch=master)](https://travis-ci.org/nteract/commuter)
[![Greenkeeper badge](https://badges.greenkeeper.io/nteract/commuter.svg)](https://greenkeeper.io/)


# com·mut·er

> /kəˈmyo͞odər/
> a person who travels some distance to work on a regular basis.

As commuters, we rush around from place to place all day. We go to work,
school, and stores. We travel to locations near and far. Eventually, we
return to our cozy home. :car: :office: :airplane: :tokyo_tower: :bullettrain_side: :department_store: :bus: :school: :bike: :city_sunset: :runner: :house_with_garden:

Like commuters, our data travels around too. Sometimes we need a notebook at
work and other times at a client's site. Wherever and whenever you need your
notebooks, **commuter** has you covered.

## What is "commuter"?

As an opinionated [nteract](https://nteract.io) focused server, **commuter**
reads notebooks from Amazon S3, has a directory explorer to find notebooks,
and provides a jupyter compatible version of the contents API. You determine
where your notebooks should reside and where they should be shared. Flexibility
and convenience.

![commuter](https://cloud.githubusercontent.com/assets/836375/23089382/e330effa-f53c-11e6-85d0-7561ccdbe163.gif)

Try **commuter** today and take your notebooks wherever you need them.

[Demo](https://nteract-commuter.herokuapp.com/)

## Roadmap

Details [here](https://github.com/nteract/commuter/blob/master/ROADMAP.md)

## Development

Requires Node.js 6+ and npm 3+.

#### Required env variables
`export COMMUTER_BUCKET=<name> COMMUTER_S3_KEY=<key> COMMUTER_S3_SECRET=<secret>`

#### Quick Start

1. `git clone git@github.com:nteract/commuter.git`
1. `npm i`
1. `npm start`
1. open `http://localhost:3000`

#### Watch mode
For more granular control and automatic reloads run following in seperate terminals:

1. `npm run client` - browser refresh
1. `npm run server:watch` - reload express on file changes
1. `npm run watch` - build lerna components

*Notes*

In watch mode, API server (express) runs on `port 4000` and the client (webpack dev server) runs on `port 3000`.
And for ease of development the webpack dev server proxies requests made on `port 3000` to `port 4000` (also avoids CORS issues).
On production, the server directly renders `index.html` with bundled static assets.

1. Directory explorer - `http://localhost:3000`
1. API server - `http://localhost:4000/api/contents/<S3_PATH>`

*Available env options*

```
COMMUTER_BUCKET (required, without s3://)
COMMUTER_S3_KEY (required)
COMMUTER_S3_SECRET (required)
COMMUTER_ES_HOST (required only for discovery api)
COMMUTER_BASEPATH (optional, prefix for s3 bucket)
COMMUTER_PATH_DELIMITER (optional, defaults to "/")
COMMUTER_PORT (optional, defaults to 4000)
```

Project uses [prettier](https://github.com/jlongster/prettier) for code formatting (`npm run format:code` and [package.json](https://github.com/nteract/commuter/blob/master/package.json) has more options).

## Tests

1. `npm test`

## Deployment

There are few different ways to get commuter deployed on your severs:

Firstly, to change default port `4000` set env variables `COMMUTER_PORT`

#### From master branch

1. Enter in the terminal:

        git clone git@github.com:nteract/commuter.git
        npm i
        npm start
        open http://localhost:3000


1. Currently, the [Demo](https://nteract-commuter.herokuapp.com/) app is deployed on [Heroku](https://www.heroku.com/).
Heroku provides [a guide for getting started with the heroku CLI](https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction) which will get you
all set up. After all **required env variables** are set, run:

        git push heroku master

#### From published packages (**recommended**)
  1. Install commuter cli `npm install @nteract/commuter-cli -g`
  1. `exec commuter server` - the service is typically wrapped inside [daemontools](https://cr.yp.to/daemontools.html)

## Publish

1. `npm publish`
1. `git push --tags`

#### commuter packages
* [@nteract/commuter-client](https://www.npmjs.com/package/@nteract/commuter-client)
* [@nteract/commuter-server](https://www.npmjs.com/package/@nteract/commuter-server)
* [@nteract/commuter-cli](https://www.npmjs.com/package/@nteract/commuter-cli)
* [@nteract/commuter-breadcrumb](https://www.npmjs.com/package/@nteract/commuter-breadcrumb)
* [@nteract/commuter-directory-listing](https://www.npmjs.com/package/@nteract/commuter-directory-listing)


