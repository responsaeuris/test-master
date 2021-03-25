#!/bin/bash
set -e # stops on first error

echo "" && echo "***********************************************************" && /_/build/scripts/print-step.sh "PUBLISH TO GITHUB REPO"

cd /_
git pull https://$GIT_USERNAME:$GIT_PASSWORD@$GIT_REPO

echo "Add GitHub repo as local repo remote"
git remote add --mirror=fetch secondary https://$PUBLIC_GIT_USERNAME:$PUBLIC_GIT_PASSWORD@$PUBLIC_GIT_REPO

# make CI fingerprint persistent
/_/build/scripts/pre-build.sh
git config --global user.email "$PUBLIC_GIT_USER_EMAIL"
git config --global user.name "$PUBLIC_GIT_USERNAME"
git add app/routes/status/statusRoute.js
git commit -am "$LAST_COMMIT CI fingerprint"

echo "Pushing to GitHub"
git push https://$PUBLIC_GIT_USERNAME:$PUBLIC_GIT_PASSWORD@$PUBLIC_GIT_REPO --all
echo "done"