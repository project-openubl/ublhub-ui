#!/bin/bash

set -e

if [[ -z "$API_URL" ]]; then
  echo "You must provide API_URL environment variable" 1>&2
  exit 1
fi

if [[ -z "$SSO_REALM" ]]; then
  echo "You must provide SSO_REALM environment variable" 1>&2
  exit 1
fi
if [[ -z "$SSO_SERVER_URL" ]]; then
  echo "You must provide SSO_SERVER_URL environment variable" 1>&2
  exit 1
fi
if [[ -z "$SSO_CLIENT_ID" ]]; then
  echo "You must provide SSO_CLIENT_ID environment variable" 1>&2
  exit 1
fi

if [ -f ./nginx.conf.template ]; then
  echo "---> Processing nginx.conf.template configuration file..."
  envsubst '${API_URL}' < ./nginx.conf.template > ./nginx.conf
  cp -v ./nginx.conf "${NGINX_CONF_PATH}"
  rm -f ./nginx.conf
fi

if [ -f ./keycloak.json.template ]; then
  echo "---> Processing keycloak.json.template configuration file..."  
  envsubst '${SSO_REALM} ${SSO_SERVER_URL} ${SSO_CLIENT_ID}' < ./keycloak.json.template > ./keycloak.json
fi

echo "Container started"

exec "$@"