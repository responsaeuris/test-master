#!/bin/bash

now=$(date +%s)sec
# set -e # stops on first error

echo "" 
echo "***********************************************************"
echo "*    1 - CLONE GIT REPO                                   *"
echo "***********************************************************"

git config --global http.sslverify false
git clone --branch $1 https://$GIT_USERNAME:$GIT_PASSWORD@$GIT_REPO project_root 

# display last commit message
echo "done! Last commit was:"
cd project_root && export LAST_COMMIT=$(git log --pretty=oneline -1)
echo $LAST_COMMIT
LAST_COMMIT=$(echo "$LAST_COMMIT" | sed -e 's/[^a-zA-Z0-9 ,.;)(]/_/g')


echo "giving 777 to build scripts"
chmod -R 777 ./build

# Branch router
echo "building branch $1"
pipelineFile="/project_root/build/pipelines/${1}.sh"

if [[ ! -f $pipelineFile ]]
then
    echo "$pipelineFile doesn't exist. Fallback: ./build/pipelines/fallback.sh"
    pipelineFile="/project_root/build/pipelines/fallback.sh"
fi

cmd="${pipelineFile}"

eval $cmd

if [ $? -eq 0 ]  
then
  printf "%s" "DONE in " $(TZ=UTC date --date now-$now +%H:%M:%S.%N) " :)"
  duration=$(TZ=UTC date --date now-$now +%H:%M:%S.%N)
  /project_root/build/scripts/teams-chat-post.sh $TEAMS_SUCCESS_WEBHOOK_URL "YEESSS" "Green" "CI succeded on branch $1 in $duration. Last commit was $LAST_COMMIT"
  exit 0
else  
  step=$(< /project_root/build/build-status.txt wc -l)
  message=$(tail -n 1 /project_root/build/build-status.txt)
  /project_root/build/scripts/teams-hero-image.sh $TEAMS_FAILURE_WEBHOOK_URL "BOOOOOM!" "https://media.giphy.com/media/3ePb1CHEjfSRhn6r3c/giphy.gif" "CI failed on branch $1 at step $step - $message :(( Last commit was $LAST_COMMIT"
  exit 1
fi


