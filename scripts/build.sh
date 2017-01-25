#!/usr/bin/env bash
set -e

ROOT_DIR=$(cd $(dirname $0)/..; pwd)
cd $ROOT_DIR

for pkg in ./packages/commuter*; do
  if [ ! -d "${pkg}/src" ]; then
    continue
  fi

  if [ "${pkg}" = "./packages/commuter-server" ] || [ "${pkg}" = "./packages/commuter-client" ]; then  #Skip server since node supports most of es6
    continue
  fi

  echo "Building ${pkg}"

  # Build
  ./node_modules/.bin/babel "${pkg}/src" \
    --out-dir "${pkg}/build" \
    --quiet

done
