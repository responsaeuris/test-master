#!/bin/bash
set -e # stops on first error

/_/build/scripts/pre-build.sh

/_/build/scripts/build-and-unit-test.sh

/_/build/scripts/deploy.sh
