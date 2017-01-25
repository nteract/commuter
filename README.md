[![Build Status](https://travis-ci.org/nteract/commuter.svg?branch=master)](https://travis-ci.org/nteract/commuter)

# com·mut·er

[![Greenkeeper badge](https://badges.greenkeeper.io/nteract/commuter.svg)](https://greenkeeper.io/)

> /kəˈmyo͞odər/
> a person who travels some distance to work on a regular basis.

Opinionated nteract focused server that persists notebooks to S3 and relies on the jupyter notebook for kernels.

## Development
Requires Node.js 6+ and npm 3+.

1. `npm run bootstrap`
1. `npm test`
1. `COMMUTER_BUCKET=<name> COMMUTER_BASEPATH=<path> npm run start`

*Available options*

```
COMMUTER_BUCKET (required without s3://)
COMMUTER_BASEPATH (optional, prefix for s3 bucket)
COMMUTER_PATH_DELIMITER (optional, defaults to "/")
COMMUTER_PORT (optional, defaults to 4000)
```

View dashboard at `http://localhost:3000/<S3_PATH>`

API at `curl -XGET http://localhost:4000/api/contents/<S3_PATH>`

Project uses [prettier](https://github.com/jlongster/prettier) for code formatting (`npm run format:code` and package.json has more options).

## TODO:
1. Support `accessKeyId` & `secretAccessKey` settings
1. Implement POST/PUT/DELETE
1. Improve test coverage

## ROADMAP

This roadmap is organized into stages of development, leading towards a backend for (mostly) real-time collaboration.

### Stage I

* List and Load notebooks from S3
  - Bucket, etc. loaded from configuration (e.g. `COMMUTER_BUCKET=xyz`)
  - Roles or Amazon environment variables automatically picked up (via `aws-sdk`)
* Tree view of notebook content
* Render page using notebook-preview

### Stage II

* Provide/use kernels from configured source (e.g. tmpnb.org, jupyterhub, or your private setup)
* Render page using nteract/nteract components
  - Requires [nteract/nteract#549](https://github.com/nteract/nteract/issues/549)

### Stage III

* Save notebooks back to S3
* Delete notebooks

### Stage IV

* Create server side in-memory model of notebook and transient models, push to clients
