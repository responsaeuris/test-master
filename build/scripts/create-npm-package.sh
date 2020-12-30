#!/bin/bash
set -e # stops on first error

echo "" && echo "***********************************************************" && /_/build/scripts/print-step.sh "INITIALIZING NPM PACKAGE"

rm /_/package.json
cd /_ && npm init -y

cat /_/package.json