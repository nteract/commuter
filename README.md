[![Build Status](https://travis-ci.org/nteract/commuter.svg?branch=master)](https://travis-ci.org/nteract/commuter) [![Heroku](https://heroku-badge.herokuapp.com/?app=nteract-commuter)]

# com·mut·er

[![Greenkeeper badge](https://badges.greenkeeper.io/nteract/commuter.svg)](https://greenkeeper.io/)

> /kəˈmyo͞odər/
> a person who travels some distance to work on a regular basis.

Opinionated nteract focused server that persists notebooks to S3, has a dashboard component and is compatible with jupyter notebook api.

[Demo](https://nteract-commuter.herokuapp.com/)

## Development
Requires Node.js 6+ and npm 3+.

1. `git clone git@github.com:nteract/commuter.git`
1. `npm install`
1. `COMMUTER_BUCKET=<name> COMMUTER_S3_KEY=<key> COMMUTER_S3_SECRET=<secret> npm start`

*Available options*

```
COMMUTER_BUCKET (required, without s3://)
COMMUTER_S3_KEY (required)
COMMUTER_S3_SECRET (required)
COMMUTER_BASEPATH (optional, prefix for s3 bucket)
COMMUTER_PATH_DELIMITER (optional, defaults to "/")
COMMUTER_PORT (optional, defaults to 4000)
```

*Notes*

API server (express) runs on port 4000 and the client (UI) on port 3000. Client uses webpack dev server and proxies 3000 -> 4000 to avoid CORS issues. On production we will let our express App serve `index.html` and static assets.

Finally, view the dashboard at `http://localhost:3000/<S3_PATH>`
and API at `curl -XGET http://localhost:4000/api/contents/<S3_PATH>`

Project uses [prettier](https://github.com/jlongster/prettier) for code formatting (`npm run format:code` and package.json has more options).

## Test
1. `npm test`

## Deployment
coming soon...

## Screen shot

![screen shot 2017-01-31 at 3 46 36 pm](https://cloud.githubusercontent.com/assets/146449/22489565/fcd4f33e-e7cc-11e6-91fc-6d24da1fbae2.png)

## ROADMAP

This roadmap is organized into stages of development, leading towards a backend for (mostly) real-time collaboration.

### Stage I

- [x] List and Load notebooks from S3
  - [x] Bucket, etc. loaded from configuration (e.g. `COMMUTER_BUCKET=xyz`)
  - [x] Roles or Amazon environment variables automatically picked up (via `aws-sdk`)
- [x] Tree view of notebook content
- [ ] Render page using notebook-preview

### Stage II

- [ ] Provide/use kernels from configured source (e.g. tmpnb.org, jupyterhub, or your private setup)
- [ ] Render page using nteract/nteract components
  - [ ] Requires [nteract/nteract#549](https://github.com/nteract/nteract/issues/549)

### Stage III

- [ ] Save notebooks back to S3
- [ ] Delete notebooks

### Stage IV

- [ ] Create server side in-memory model of notebook and transient models, push to clients
