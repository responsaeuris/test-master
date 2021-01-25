#!/bin/bash
set -e # stops on first error

/_/build/scripts/pre-build.sh

if [ $? -eq 14 ]  
then
  exit 0
fi

/_/build/scripts/build-and-unit-test.sh

/_/build/scripts/deploy.sh
