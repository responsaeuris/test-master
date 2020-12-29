#!/bin/bash
set -e # stops on first error

echo "" && echo "***********************************************************" && /project_root/build/scripts/print-step.sh "REPLACING ELK URI"

echo "checking if Constants contains default_uri"

default_uri=https://elastic:elastic@localhost:9200
occurences=$(grep -o -i $default_uri /project_root/PluginCore/Constants.cs | wc -l)

if [ $occurences = 0 ]
then
  echo "default elk uri $default_uri was not found in /project_root/PluginCore/Constants.cs, build aborted"
  exit 1
fi

echo "checking if ELK_URI is defined"

if [ -z "$ELK_URI" ]
then
  echo "global variable ELK_URI is not defined, put it in machine-keys.env"
  exit 1
fi

echo "replacing elk uri from machine-keys.env"

sed -i "s|$default_uri|$ELK_URI|g" /project_root/PluginCore/Constants.cs