#!/bin/bash
set -e # stops on first error

echo "" && echo "***********************************************************" && /project_root/build/scripts/print-step.sh "BUILD SOURCES"

dotnet add /project_root/PluginCore.Test package coverlet.collector
cd /project_root && dotnet build PluginCore.sln


echo "" && echo "***********************************************************" && /project_root/build/scripts/print-step.sh "RUN UNIT TESTS"

set +e # disable stops on first error to allow report for failed tests
dotnet test /project_root/PluginCore.Test/PluginCore.Test.csproj -l:"trx;LogFilename=/test-reports/TestResult.trx" --collect:"XPlat Code Coverage" --results-directory:"/test-reports"
test_result=$?

set -e # re-enable stops on first error

echo "" && echo "***********************************************************" && /project_root/build/scripts/print-step.sh "ELABORATING TESTS REPORTS"

trx2junit /test-reports/TestResult.trx

#mv /test-reports/*/coverage.cobertura.xml /test-reports/ --backup=numbered
reportgenerator "-reports:/test-reports/*/coverage.cobertura.xml" "-targetdir:/test-reports" "-reporttypes:Html;Clover"

if [ $test_result -ne 0 ]
then
  echo "Unit test phase failed, build aborted"
  exit $test_result
fi