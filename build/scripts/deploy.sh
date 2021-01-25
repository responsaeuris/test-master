#!/bin/bash
set -e # stops on first error

echo "" && echo "***********************************************************" && /_/build/scripts/print-step.sh "PUBLISH TO GITHUB REPO"

cd /_
echo "Add GitHub repo as local repo remote"
git remote add --mirror=fetch secondary https://responsaeuris:Eur1s2020!@github.com/responsaeuris/responsa-plugin-core-js.git
git fetch https://$GIT_USERNAME:$GIT_PASSWORD@$GIT_REPO
echo "Pushing to GitHub"
git push https://responsaeuris:Eur1s2020!@github.com/responsaeuris/responsa-plugin-core-js.git --all
echo "done"