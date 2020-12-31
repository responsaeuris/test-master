#!/bin/bash
set -e # stops on first error

target_file=$1
find=$2
replace_with=$3

echo "searching $find in $target_file"

occurences=$(grep -o -i $find $target_file | wc -l)

if [ $occurences = 0 ]
then
  echo "text $find was not found in $target_file, build aborted"
  exit 1
fi

sed -i "/$find/c\ $replace_with" $target_file
echo "$target_file contents:"
cat $target_file