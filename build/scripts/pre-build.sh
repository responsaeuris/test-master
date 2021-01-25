#!/bin/bash
set -e # stops on first error

echo "" && echo "***********************************************************" && /_/build/scripts/print-step.sh "CHECKING IF VERSION BUMPING IS NEEDED"
cd /_/app
ls -la
echo "Current branch: $GIT_BRANCH"
echo "Changed into app dir"
git diff HEAD~1 HEAD -- package.json
echo "done"
modVersion=$(git diff HEAD~1 HEAD -- package.json | grep -c version)
echo "ModVersion: $modVersion"

if [ $modVersion -lt 2 ]
then
  echo "Version was not changed in this commit... Bumping new version"
  currentVersion=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[\",]//g' | tr -d '[[:space:]]')
  echo "Current version: $currentVersion"
  bumpType="patch"
  if [ "${GIT_BRANCH}" == "master" ]
  then
    bumpType="minor"
  fi
  echo "Bumping new $bumpType version ..."
  newVersion=$(npm version $bumpType)
  oldCommitMessage=$(git log -1 --pretty=%B | cat)
  echo "New version: $newVersion"
  echo "Committing and pushing version bumping ...."
  git commit -a -m "$oldCommitMessage (CI commit bumping version to $newVersion)"
  git push https://$GIT_USERNAME:$GIT_PASSWORD@$GIT_REPO
  echo "Pushed changed version. Exiting for next build to run"
  exit 0
fi

echo "Version already changed ... nothing to do here"
cd /

echo "" && echo "***********************************************************" && /_/build/scripts/print-step.sh "GENERATING BUILD FINGERPRINT"

sed -i "s|CI_PUTS_HERE_LAST_GIT_COMMIT|$LAST_COMMIT|g" /_/app/routes/status/statusRoute.js
today=$(date)
sed -i "s|CI_PUTS_HERE_DEPLOY_DATE|$today|g" /_/app/routes/status/statusRoute.js

cat /_/app/routes/status/statusRoute.js

