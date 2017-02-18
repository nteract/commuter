[![Heroku](https://heroku-badge.herokuapp.com/?app=nteract-commuter&svg=1)](https://nteract-commuter.herokuapp.com/)
[![Build Status](https://travis-ci.org/nteract/commuter.svg?branch=master)](https://travis-ci.org/nteract/commuter)
[![Greenkeeper badge](https://badges.greenkeeper.io/nteract/commuter.svg)](https://greenkeeper.io/)


# com·mut·er

> /kəˈmyo͞odər/
> a person who travels some distance to work on a regular basis.

Opinionated [nteract](https://nteract.io) focused server. Commuter reads notebooks from S3, has a directory explorer, and provides a jupyter compatible version of the contents API.

![commuter](https://cloud.githubusercontent.com/assets/836375/23089382/e330effa-f53c-11e6-85d0-7561ccdbe163.gif)

[Demo](https://nteract-commuter.herokuapp.com/)

## Development
Requires Node.js 6+ and npm 3+.

1. `git clone git@github.com:nteract/commuter.git`
1. `npm install`
1. `COMMUTER_BUCKET=<name> COMMUTER_S3_KEY=<key> COMMUTER_S3_SECRET=<secret> npm start`

*Available env options*

```
COMMUTER_BUCKET (required, without s3://)
COMMUTER_S3_KEY (required)
COMMUTER_S3_SECRET (required)
COMMUTER_BASEPATH (optional, prefix for s3 bucket)
COMMUTER_PATH_DELIMITER (optional, defaults to "/")
COMMUTER_PORT (optional, defaults to 4000)
```

*Notes*

The API server (express) runs on port 4000 while the client (UI) runs on port 3000. The client uses the webpack dev server and proxies 3000 -> 4000 to avoid CORS issues. On production the express App serves `index.html` and static assets.

View the dashboard at `http://localhost:3000/<S3_PATH>` and the API at `http://localhost:4000/api/contents/<S3_PATH>`

Project uses [prettier](https://github.com/jlongster/prettier) for code formatting (`npm run format:code` and package.json has more options).

## Test
1. `npm test`

## Deployment

coming soon...

## ROADMAP

This roadmap is organized into stages of development, leading towards a backend for (mostly) real-time collaboration.

### Stage I

- [x] List and Load notebooks from S3
  - [x] Bucket, etc. loaded from configuration (e.g. `COMMUTER_BUCKET=xyz`)
  - [x] Roles or Amazon environment variables automatically picked up (via `aws-sdk`)
- [x] Tree view of notebook content
- [x] Render page using notebook-preview

### Stage II

- [ ] Start outlining an authentication and permissions strategy
- [ ] Provide/use kernels from configured source (e.g. tmpnb.org, jupyterhub, or your private setup)
- [x] Render page using nteract/nteract components

### Stage III

- [ ] Save notebooks back to S3
- [ ] Delete notebooks

### Stage IV

- [ ] Create server side in-memory model of notebook and transient models, push to clients
