DOCKER_IMAGE_NAME="caophuoclongse/chatapp"
docker build -t $DOCKER_IMAGE_NAME:server ./backend
docker build -t $DOCKER_IMAGE_NAME:client ./frontend