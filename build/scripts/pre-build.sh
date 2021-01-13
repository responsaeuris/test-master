#!/bin/bash
set -e # stops on first error

echo "" && echo "***********************************************************" && /_/build/scripts/print-step.sh "REPLACING ELK URI"

echo "checking if Constants contains default_uri"

default_uri=https://localhost:9200
occurences=$(grep -o -i $default_uri /_/app/config/constants.js | wc -l)

if [ $occurences = 0 ]
then
  echo "default elk uri $default_uri was not found in /_/app/config/constants.js, build aborted"
  exit 1
fi

echo "checking if ELK_URI is defined"

if [ -z "$ELK_URI" ]
then
  echo "global variable ELK_URI is not defined, put it in machine-keys.env"
  exit 1
fi

echo "replacing elk uri from machine-keys.env"

sed -i "s|$default_uri|$ELK_URI|g" /_/app/config/constants.js

echo "" && echo "***********************************************************" && /_/build/scripts/print-step.sh "GENERATING BUILD FINGERPRINT"

sed -i "s|CI_PUTS_HERE_LAST_GIT_COMMIT|$LAST_COMMIT|g" /_/app/routes/status/statusRoute.js
today=$(date)
sed -i "s|CI_PUTS_HERE_DEPLOY_DATE|$today|g" /_/app/routes/status/statusRoute.js

cat /_/app/routes/status/statusRoute.js

