#!/bin/bash
set -e # stops on first error

echo URL: $1

curl -4 --retry 10 --retry-connrefused $1

errstatus=$?

if [ $errstatus != 0 ]
then
  echo "Cannot Curl $1 - returning $errstatus"  
  exit $errstatus
fi