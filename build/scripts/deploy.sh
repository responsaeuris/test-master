#!/bin/bash
set -e # stops on first error

echo "" && echo "***********************************************************" && /_/build/scripts/print-step.sh "PUBLISH TO GITHUB REPO"

cd /_
echo "Add GitHub repo as local repo remote"
git remote add --mirror=fetch secondary https://$PUBLIC_GIT_USERNAME:$PUBLIC_GIT_PASSWORD@$PUBLIC_GIT_REPO
git fetch https://$GIT_USERNAME:$GIT_PASSWORD@$GIT_REPO

echo "Pushing to GitHub"
git push https://$PUBLIC_GIT_USERNAME:$PUBLIC_GIT_PASSWORD@$PUBLIC_GIT_REPO --all

echo "make CI fingerprint persistent"
cd /
git clone --branch $GIT_BRANCH https://$PUBLIC_GIT_USERNAME:$PUBLIC_GIT_PASSWORD@$PUBLIC_GIT_REPO /public-repo
/_/build/scripts/pre-build.sh
cp /_/app/routes/status/statusRoute.js /public-repo/app/routes/status/statusRoute.js
cd /public-repo
git config --global user.email "$PUBLIC_GIT_USER_EMAIL"
git config --global user.name "$PUBLIC_GIT_USERNAME"
git add app/routes/status/statusRoute.js
git commit -am "$LAST_COMMIT CI fingerprint"
git push origin $GIT_BRANCH
echo "done"