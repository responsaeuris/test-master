#!/bin/bash
set -e # stops on first error

echo "\n$1" >> /_/build/build-status.txt

step=$(< /_/build/build-status.txt wc -l)
step=$((step +1))

echo "***********************************************************"
echo "*    $step - $1"
echo "***********************************************************"
