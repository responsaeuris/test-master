#!/bin/bash
set -e

PROJECT=$1

echo "" && echo "***********************************************************" && /_/build/scripts/print-step.sh "CODE ANALYSIS"

echo "Creating Sonar Scanner configuration..."
cd /var/opt/sonar-scanner-cli/conf
rm -rf sonar-scanner.properties
echo "sonar.host.url=$SONARQUBE_URL" > sonar-scanner.properties

echo "Creating $PROJECT Sonar project configuration..."
cd /_/app
rm -rf sonar-project.properties
echo "sonar.projectKey=$PROJECT" > sonar-project.properties
echo "sonar.sources=." >> sonar-project.properties
echo "sonar.exclusions=**/coverage/*,**/coverage/**/*" >> sonar-project.properties
echo "sonar.tests=test" >> sonar-project.properties
echo "sonar.javascript.lcov.reportPaths=coverage/lcov.info" >> sonar-project.properties
echo "sonar.coverage.exclusions=**/coverage/*,**/coverage/**/*,**/*test*" >> sonar-project.properties
echo "sonar.test.inclusions=**/*test*" >> sonar-project.properties
echo "sonar.testExecutionReportPaths=test-report-sonar.xml" >> sonar-project.properties

echo "Launching Sonar Scanner Analysis..."
sonar-scanner -Dsonar.login=$SONARQUBE_TOKEN

echo "Getting $PROJECT Quality Gate Status..."
#jq '[.projectStatus.conditions[] | {metric: .metricKey, status: .status}]'
BASIC_AUTH=$(echo -n "$SONARQUBE_TOKEN:" | base64)
RESULT=$(curl --location --request GET "$SONARQUBE_URL/api/qualitygates/project_status?projectKey=$PROJECT" \
--header "Authorization: Basic $BASIC_AUTH")
echo "$PROJECT project status:"
echo $RESULT | jq .
QUALITY_GATE=$(echo $RESULT | jq .projectStatus.status)
temp="${QUALITY_GATE%\"}"
QUALITY_GATE="${temp#\"}"

NC='\033[0m'
COLOR='\033[0m'

if [[ "$QUALITY_GATE" = "ERROR" ]]
then
COLOR='\033[0;31m'
fi

if [[ "$QUALITY_GATE" = "WARN" ]]
then
COLOR='\033[0;33m'
fi

if [[ "$QUALITY_GATE" = "OK" ]]
then
COLOR='\033[0;32m'
fi

echo "--------------------------------------------------------"
echo -e "${COLOR}QUALITY GATE IS: $QUALITY_GATE${NC}"
echo "--------------------------------------------------------"

#Saving result for outer scripts
rm -rf /sonar-qg
echo $QUALITY_GATE > /sonar-qg
