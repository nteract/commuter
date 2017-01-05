# com·mut·er

> /kəˈmyo͞odər/
> a person who travels some distance to work on a regular basis.

Opinionated nteract focused server that persists notebooks to S3 and relies on the jupyter notebook for kernels.

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
