#!/bin/bash
GIT_BRANCH=`git rev-parse --abbrev-ref HEAD`

echo "Committing to $GIT_BRANCH"

if [ $GIT_BRANCH != "master" ];
then
    export VERSION=$(npm version patch --force)
fi

if [ $GIT_BRANCH == "master" ];
then
    export VERSION=$(npm version major --force)
fi

git add --all

echo "New package version: $VERSION"