FROM jenkins/jenkins:lts

USER root

# Instalar Node.js LTS
RUN apt-get update && apt-get install -y curl \
    && curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - \
    && apt-get install -y nodejs

USER jenkins