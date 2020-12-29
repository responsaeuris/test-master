#!/bin/bash
set -e # stops on first error

echo "" && echo "***********************************************************" && /project_root/build/scripts/print-step.sh "PUBLISH THE APP LOCALLY"

dotnet publish /project_root/PluginCore/PluginCore.csproj -c Release -o /project_root/out

echo "" && echo "***********************************************************" && /project_root/build/scripts/print-step.sh "SERVE THE LOCAL APP"

cd /project_root/out && dotnet PluginCore.dll & 
echo "child process spawned"

echo "" && echo "***********************************************************" && /project_root/build/scripts/print-step.sh "CHECK IF APP IS UP (aha!)"

/project_root/build/scripts/curl-retry.sh "http://localhost:5000/swagger/index.html"

echo "app is up and (maybe) running!"

echo "" && echo "***********************************************************" && /project_root/build/scripts/print-step.sh "RUN END-TO-END TESTS"

set +e # disable stops on first error to allow report for failed tests

cd /project_root/Postman/ && newman run PluginCore.postman_collection.json -e plugin_core_local_env.postman_environment.json --insecure -r junit --reporter-junit-export '/test-reports/E2ETestResult.xml'
test_result=$?

set -e # re-enable stops on first error

if [ $test_result -ne 0 ]
then
  echo "E2E test phase failed, build aborted"
  exit $test_result
fi