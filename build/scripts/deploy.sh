#!/bin/bash
set -e # stops on first error

echo "" && echo "***********************************************************" && /_/build/scripts/print-step.sh "PUBLISH TO NPM REGISTRY"

cd /_/app/
echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" >> .npmrc

npm publish

rm .npmrc