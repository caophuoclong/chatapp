DOCKER_TAG=1.0.0
# echo $1
docker build -t $DOCKER_SERVER ./backend
docker build -t $DOCKER_CLIENT ./frontend
docker tag $DOCKER_SERVER $DOCKER_SERVER:$DOCKER_TAG
docker tag $DOCKER_CLIENT $DOCKER_CLIENT:$DOCKER_TAG
docker push $DOCKER_SERVER:$DOCKER_TAG
docker push $DOCKER_CLIENT:$DOCKER_TAG


