#!/bin/bash

set -e # stops on first error

echo "" && echo "***********************************************************" && /project_root/build/scripts/print-step.sh "GET THE ACTUAL PACKAGE VERSION NUMBER FROM SERVER"

MAJOR=$(curl https://out-nuget.azurewebsites.net/nuget/Packages | grep "<id>https://" | grep "nuget/Packages(Id='$1',Version='" | awk -F'[^0-9]*' '/[0-9]/ { print ($1 != "" ? $1 : $2) }' | sort -rn | head -n 1)
MINOR=$(curl https://out-nuget.azurewebsites.net/nuget/Packages | grep "<id>https://" | grep "nuget/Packages(Id='$1',Version='$MAJOR." | awk -F'[^0-9]*' '/[0-9]/ { print ($3) }' | sort -rn | head -n 1)
BATCH=$(curl https://out-nuget.azurewebsites.net/nuget/Packages | grep "<id>https://" | grep "nuget/Packages(Id='$1',Version='$MAJOR.$MINOR" | awk -F'[^0-9]*' '/[0-9]/ { print ($4) }' | sort -rn | head -n 1)

echo -e "\n"

echo $1 Old Package Version=$MAJOR.$MINOR.$BATCH

echo "" && echo "***********************************************************" && /project_root/build/scripts/print-step.sh "INCREMENT VERSION NUMBER BY ONE"

NEW_BATCH=$((BATCH+1))

echo $1 New Package Version=$MAJOR.$MINOR.$NEW_BATCH

echo "" && echo "***********************************************************" && /project_root/build/scripts/print-step.sh "CREATE NuGet PACKAGE AND PLACE IT INSIDE SERVER FOLDER"

dotnet pack /project_root/PluginCore/PluginCore.csproj -o /project_root -p:PackageVersion=$MAJOR.$MINOR.$NEW_BATCH

echo "" && echo "***********************************************************" && /project_root/build/scripts/print-step.sh "PUSH THE PACKAGE IN THE NUGET SERVER"

dotnet nuget push /project_root/PluginCore.*.nupkg -k $NUGET_API_KEY -s $NUGET_SERVER
