# Clone project
git clone https://github.com/jeboehm/docker-mailserver.git
cd docker-mailserver
# Build image
cp ../docker-mailserver-env/.env.dist .env
# to pull docker image
bin/production.sh pull
# to build docker container and run background
bin/production.sh up -d

#First run need to be run coomand
#bin/production.sh run --rm web setup.sh