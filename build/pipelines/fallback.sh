#!/bin/bash
set -e # stops on first error

/project_root/build/scripts/pre-build.sh

/project_root/build/scripts/build-and-unit-test.sh
