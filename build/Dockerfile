FROM mcr.microsoft.com/mssql/server:2019-latest

# set sql server env variables
ENV ACCEPT_EULA=Y
ENV MSSQL_SA_PASSWORD='<YourStrong!Passw0rd>'

# install sudo & nano & ftp & zip & unzip
USER root
RUN apt update && apt install -y sudo 
RUN apt-get update
RUN apt-get install -y nano ftp lftp zip unzip
RUN apt install -y ftp
RUN apt-get install -y lftp
RUN apt install -y zip unzip

# install git
RUN sudo apt install -y git
RUN git --version

# install node
RUN apt-get install -y curl \
  && curl -sL https://deb.nodesource.com/setup_14.x | bash - \
  && apt-get install -y nodejs \
  && curl -L https://www.npmjs.com/install.sh | sh

# install newman
RUN npm install -g newman

# install netcore sdk
RUN wget https://packages.microsoft.com/config/ubuntu/19.10/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
RUN sudo dpkg -i packages-microsoft-prod.deb
RUN sudo apt-get update
RUN sudo apt-get install apt-transport-https
RUN sudo apt-get update
RUN sudo apt-get install -y dotnet-sdk-3.1

# install coverage tools
RUN dotnet tool install -g trx2junit
RUN dotnet tool install --global dotnet-reportgenerator-globaltool --version 4.6.1
ENV PATH="/root/.dotnet/tools:${PATH}"

#install azure cli
RUN curl -sL https://aka.ms/InstallAzureCLIDeb | bash

# copy the entry point script
COPY ./boot.sh ./boot.sh

RUN apt-get update && apt-get install -y dos2unix
RUN dos2unix /boot.sh && apt-get --purge remove -y dos2unix && rm -rf /var/lib/apt/lists/*

#Required for System.Drawing
RUN apt-get update && apt-get install -y libgdiplus

ENTRYPOINT []