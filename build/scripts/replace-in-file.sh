#!/bin/bash
set -e # stops on first error

target_file=$1
find=$2
replace_with=$3

sed -i "/$find/c\ $replace_with" $target_file
echo "$target_file contents:"
cat $target_file