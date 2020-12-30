#!/bin/bash
set -e # stops on first error

echo "" && echo "***********************************************************" && /_/build/scripts/print-step.sh "INITIALIZING NPM PACKAGE"

packageJson=/_/package.json
rm $packageJson

cd /_ && npm init -y

find="\"license\": \"ISC\""
replace="\"license\": \"ISC\", \"files\": [ \"app\" ]"
/_/build/scripts/replace-in-file.sh $packageJson $find $replace

find=gattucci
replace="\"url\": \"https://stash.getconnected.it/scm/rspevo/plugin-core-js.git\""
/_/build/scripts/replace-in-file.sh $packageJson $find $replace

cat $packageJson