#!/bin/bash
set -e # stops on first error

echo "" && echo "***********************************************************" && /_/build/scripts/print-step.sh "CLEANING TEST FOLDER"

# creates output directory if not exists (locally it will be created on bamboo it will not create cause a docker volume is mounted under /test-reports)
mkdir -p /test-reports 

cd /test-reports && rm -rf ./* && cd ..

echo "test folder recreated"
cd /test-reports && ls -l && cd .. # count content of /test-reports folder

echo "" && echo "***********************************************************" && /_/build/scripts/print-step.sh "RESTORING PACKAGES SOURCES"

cd /_/app/
npm config set store-dir /test-reports/.pnpm-store
npm set progress=false
npm i --prefer-offline

echo "" && echo "***********************************************************" && /_/build/scripts/print-step.sh "LINTING"
npm run lint

echo "" && echo "***********************************************************" && /_/build/scripts/print-step.sh "RUNNING UNIT TEST"
npm run jest:ci

echo "copying unit test result to /test-result folder"
cp test-report.xml /test-reports/TestResult.xml

echo "copying coverage reports to /test-result folder"
cd coverage/lcov-report

mv -v ./* /test-reports/