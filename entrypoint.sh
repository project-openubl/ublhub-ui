#!/bin/bash

set -e

if [[ -z "$API_URL" ]]; then
    echo "You must provide API_URL environment variable" 1>&2
    exit 1
fi

if [ -f ./nginx.conf.template ]; then
  echo "---> Processing nginx.conf.template configuration file..."
  envsubst '${API_URL}' < ./nginx.conf.template > ./nginx.conf
  cp -v ./nginx.conf "${NGINX_CONF_PATH}"
  rm -f ./nginx.conf
fi

exec "$@"