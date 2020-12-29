#!/bin/bash
set -e # stops on first error

echo "\n$1" >> /project_root/build/build-status.txt

step=$(< /project_root/build/build-status.txt wc -l)
step=$((step +1))

echo "***********************************************************"
echo "*    $step - $1"
echo "***********************************************************"
