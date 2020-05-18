##################################
# Build
##################################
FROM node:14 as build

RUN mkdir -p /opt/build;

WORKDIR /opt/build

# Would be a bit simpler if the code was inside a top-level src folder
COPY ./backend ./backend
COPY ./components ./components
COPY ./pages ./pages
COPY ./public ./public
COPY ./shims ./shims
COPY ./transforms ./transforms
COPY [ \
  "babel.config.js", \
  "frontend.js", \
  "next.config.js", \
  "package.json", \
  "theme.js", \
  "yarn.lock", \
  "./" \
]

RUN yarn install \
  && yarn build

##################################
# Dependencies
##################################
FROM node:14 as dependencies

RUN DEBIAN_FRONTEND=noninteractive \
  apt-get update && \
  apt-get install --yes --no-install-recommends \
  build-essential \
  libcairo2-dev \
  libpango1.0-dev \
  libjpeg-dev \
  libgif-dev \
  librsvg2-dev

ENV NODE_ENV='production'

RUN mkdir -p /opt/build;

WORKDIR /opt/build

COPY --from=build [ "/opt/build/package.json", "/opt/build/yarn.lock", "./" ]

RUN yarn install --production=true

##################################
# Release
##################################
FROM node:14-slim as release

ENV NODE_ENV='production'

RUN mkdir -p /opt/app;

WORKDIR /opt/app

COPY --from=build /opt/build/.next /opt/app/.next
COPY --from=build /opt/build/frontend.js /opt/app/
COPY --from=build /opt/build/lib /opt/app/lib
COPY --from=build /opt/build/public /opt/app/public
COPY --from=dependencies /opt/build/node_modules /opt/app/node_modules

ENV PORT=4000

EXPOSE 4000

CMD [ "node", "lib/index.js" ]
