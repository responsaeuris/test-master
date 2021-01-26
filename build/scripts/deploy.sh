#!/bin/bash
set -e # stops on first error

echo "" && echo "***********************************************************" && /_/build/scripts/print-step.sh "PUBLISH TO GITHUB REPO"

cd /_
echo "Add GitHub repo as local repo remote"
git remote add --mirror=fetch secondary https://$PUBLIC_GIT_USERNAME:$PUBLIC_GIT_PASSWORD@$PUBLIC_GIT_REPO
git fetch https://$GIT_USERNAME:$GIT_PASSWORD@$GIT_REPO
echo "Pushing to GitHub"
git push https://$PUBLIC_GIT_USERNAME:$PUBLIC_GIT_PASSWORD@$PUBLIC_GIT_REPO --all
echo "done"