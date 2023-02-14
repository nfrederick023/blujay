#!/bin/bash

set -xe

cd client
rm -rf .next
yarn
yarn build
cd ..

bash ./bundle-client.sh
docker build --network=host -t nfrederick023/better-clipface:latest -t nfrederick023/better-clipface:1.02 .
rm client/docker-bundle.tgz
