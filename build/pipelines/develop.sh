#!/bin/bash
set -e # stops on first error

/_/build/scripts/pre-build.sh

/_/build/scripts/build-and-unit-test.sh

/_/build/scripts/deploy.sh

/_/build/scripts/sonarqube.sh plugin-core-js

echo "Cleaning up artifacts"
rm -rf test-report.xml
rm -rf test-report-sonar.xml
rm -rf coverage/lcov-report
