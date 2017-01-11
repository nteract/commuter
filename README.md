[![Build Status](https://travis-ci.org/nteract/commuter.svg?branch=master)](https://travis-ci.org/nteract/commuter)

# com·mut·er

> /kəˈmyo͞odər/
> a person who travels some distance to work on a regular basis.

Opinionated nteract focused server that persists notebooks to S3 and relies on the jupyter notebook for kernels.

## Development
Requires Node.js 6+ and npm 3+.

Set S3 bucket in `config.js` and then

1. `npm run bootstrap`
1. `npm test`
1. `bucket=<name> basePath=<path> npm run start:watch`

*Available options*

```
bucket (required without s3://)
basePath (optional, prefix for s3 bucket)
pathDelimiter (optional, defaults to "/")
port (optional, defaults to 3000)
```

`http://localhost:3000/api/contents/<S3_PATH>`

Project uses [prettier](https://github.com/jlongster/prettier) for code formatting (included in dev deps). 

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
