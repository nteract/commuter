[![Glitch Deployed](https://img.shields.io/badge/glitch-deployed-3652d3.svg)](https://nteract-commuter-glitch-demo.glitch.me/view/)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

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
reads notebooks from a local directory or Amazon S3, has a directory explorer to find notebooks,
and provides a jupyter compatible version of the contents API. You determine
where your notebooks should reside and where they should be shared. Flexibility
and convenience.

![commuter](https://cloud.githubusercontent.com/assets/836375/23089382/e330effa-f53c-11e6-85d0-7561ccdbe163.gif)

Try **commuter** today and take your notebooks wherever you need them.

- [Demo](https://nteract-commuter-glitch-demo.glitch.me/view/)
- [Remix Demo](https://glitch.com/edit/#!/remix/nteract-commuter-glitch-demo)
- [Demo Source](https://github.com/nteract/commuter-on-glitch)

## Installation

You may use whichever package manager (`npm` or `yarn`) best suits your workflow. The `nteract` team internally uses `yarn`.

```
npm install @nteract/commuter -g
# OR
yarn global add @nteract/commuter
```

## Usage

Configure and run commuter with environment variables and `commuter server`.

Example local run (using a network file share!):

```sh
COMMUTER_LOCAL_STORAGE_BASEDIRECTORY=/efs/users/ commuter
```

Example S3 run:

```sh
COMMUTER_BUCKET=sweet-notebooks commuter
```

## Environment Variables

### General Environment Variables

| Environment Variable                   | Description                              | Default         |
| -------------------------------------- | :--------------------------------------- | :-------------- |
| `COMMUTER_STORAGE_BACKEND`             | `local`, `s3`, or `gcs`                  | `local`         |
| `COMMUTER_DISCOVERY_BACKEND`           | either elasticsearch or none             | `"none"`        |
| `COMMUTER_PORT`                        | Port to run commuter on                  | 4000            |
| `COMMUTER_LOCAL_STORAGE_BASEDIRECTORY` | directory to serve in local storage mode | `process.cwd()` |
| `COMMUTER_ES_HOST`                     | ElasticSearch Host                       | `""`            |

### Environment Variables for S3 Storage

| Environment Variable         | Description                                     | Default                                                    |
| ---------------------------- | :---------------------------------------------- | :--------------------------------------------------------- |
| `COMMUTER_S3_BASE_PREFIX`    | prefix on the bucket, similar to base directory | `""`                                                       |
| `COMMUTER_S3_PATH_DELIMITER` | separator for "paths"                           | `"/"`                                                      |
| `COMMUTER_BUCKET`            | bucket contents served from                     | Required in S3 mode, no default                            |
| `COMMUTER_S3_KEY`            | AWS Key                                         | Optional, uses IAM roles or `~/.aws/credentials` otherwise |
| `COMMUTER_S3_SECRET`         | AWS Secret                                      | Optional, uses IAM roles or `~/.aws/credentials` otherwise |
| `COMMUTER_S3_ENDPOINT`       | S3 endpoint                                     | Optional, selected automatically                           |
| `COMMUTER_S3_FORCE_PATH_STYLE`| Set to `true` to activate `s3ForcePathStyle`. Forces path-style URLs for s3 objects, therefore URLs will be in the form `<endpoint>/<bucket>/<key>` instead of `<bucket>.<endpoint>/<key>`     | `false`                                                      |

### Environment Variables for Google Storage

| Environment Variable             | Description                                                       | Default |
| ---------------------------------| :---------------------------------------------------------------- | :------ |
| `GOOGLE_APPLICATION_CREDENTIALS` | file path of the JSON file that contains your service account key | `""`    |

## Roadmap

[ROADMAP Document](./ROADMAP.md)

## Development

#### Quick Start

1. `git clone git@github.com:nteract/commuter.git`
1. `cd commuter`
1. `yarn`
1. `yarn dev`
1. open `http://localhost:4000`

#### Dev Docker
A Dockerfile for a local dev server can be use as follows:

1. `docker build -t commuter:dev -f Dockerfile.dev .`
1. Run this:
<pre>
docker run \
    --init \
    --interactive \
    --tty \
    --rm \
    --publish 4000:4000 \
    --mount type=bind,source=(pwd),target=/app \
    --env COMMUTER_LOCAL_STORAGE_BASEDIRECTORY=/app/examples \
    commuter:dev
</pre>

## Tests

There are three ways you can run tests:

- If you have your environment set up, you can run tests locally via `yarn test`.
- This repository is also set up with [GitHub Actions](https://github.com/features/actions), a builtin CI system, which will automatically trigger test builds for multiple Node versions upon every push into this repository. You can then check out the results in the [Actions tab](https://github.com/nteract/commuter/actions).
- These GitHub Actions can be triggered locally using [act](https://github.com/nektos/act), this way you don't have to have your JavaScript environment set up and you don't have to commit and push in order to run the tests remotely through GitHub.

## Deployment

1. Install commuter cli `yarn add @nteract/commuter`
1. `exec commuter` - the service is typically wrapped inside [daemontools](https://cr.yp.to/daemontools.html)

## Deployment (Docker / Kubernetes)

A `Dockerfile` intended for Production use (suitable for Kubernetes or other container runtime) has 
been contributed. Instructions are below. 

Note: there is no officially published Docker image at this time, you should publish it to your own
image registry.

1. Build and tag image `docker build --tag commuter:latest .`
1. Image can be executed as follows:
<pre>
docker run \
--publish 4000:4000 \
--mount type=bind,source=/home/username/work/commuter/examples,target=/examples \
--env COMMUTER_LOCAL_STORAGE_BASEDIRECTORY=/examples \
commuter:latest
</pre>
