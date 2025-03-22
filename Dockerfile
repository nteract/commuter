##################################
# Build
##################################
FROM node:12-buster as build

# Install required system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    python \
    make \
    g++ \
    git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /opt/build

# Copy package files
COPY package.json yarn.lock ./

# Install missing peer dependencies first
RUN yarn add styled-components@4 immutable@4.0.0-rc.12 react@16.8.6 react-dom@16.8.6

# Install dependencies with increased memory limit and no frozen lockfile
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN yarn install --network-timeout 600000

# Copy source files
COPY . .

# Build the application
RUN yarn build:server && \
    yarn build:frontend-for-production

##################################
# Release
##################################
FROM node:12-slim as release

# Install tini
ENV TINI_VERSION v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini

WORKDIR /opt/app

# Copy built files from build stage
COPY --from=build /opt/build/.next ./.next
COPY --from=build /opt/build/lib ./lib
COPY --from=build /opt/build/node_modules ./node_modules
COPY --from=build /opt/build/package.json ./package.json
COPY ./public ./public

ENV NODE_ENV=production
EXPOSE 4000

ENTRYPOINT ["/tini", "-g", "--"]
CMD ["node", "lib/index.js"]