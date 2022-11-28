DOCKER_TAG=1.0.2
options="$@"
build_backend(){
    docker build -t server ./backend
}
build_frontend(){
    docker build -t client ./frontend
}
build_all(){
    build_backend
    build_frontend
}
push_backend(){
    docker tag server $DOCKER_SERVER:$DOCKER_TAG
    docker push $DOCKER_SERVER:$DOCKER_TAG
}
push_frontend(){
    docker tag client $DOCKER_CLIENT:$DOCKER_TAG
    docker push $DOCKER_CLIENT:$DOCKER_TAG
}
push_all(){
    push_backend
    push_frontend
}
param="$@"
if [ -z "$param" ];then
    echo "Usage: build.docker.sh [-b] [-p]"
    echo "  -b: build [a|b|f] images"
    echo "  -p: push [a|b|f] images"
    exit 1
else
    while getopts ":b:p:" opt;do
    case $opt in
                b)
                building="$OPTARG"
                ;;
                p)
                pushing="$OPTARG"
                ;;
                \?)
                    echo "Usage: build.docker.sh [-b] [-p]"
                    echo "  -b: build [a|b|f] images"
                    echo "  -p: push [a|b|f] images"
                    exit 1
                     echo "Invalid option: $OPTARG" 
                ;;
    esac
    done
    if [ "$building" = "a" ] ;then
        echo "Building all"
        build_all
        echo "Build completed"
    elif [ "$building" = "b" ] ;then
        echo "Building backend"
        build_backend
        echo "Build completed"

    elif [ "$building" = "f" ] ;then
        echo "Building frontend"
        build_frontend
        echo "Build completed"
    else
        echo "Please use: \n'a' to build all, \n'b' to build backend, \n'f' to build frontend"
    fi
    if [ -z "$pushing" ]; then
        echo "Nothing to push" 
    else
        if [ "$pushing" = "a" ];then
            echo "Pushing all"
            push_all
            echo "Build completed"
        elif [ "$pushing" = "b" ] ;then
            echo "Pushing backend"
            push_backend
            echo "Build completed"
        elif [ "$pushing" = "f" ] ;then
            echo "Pushing frontend"
            push_frontend
            echo "Build completed"
        else 
            echo "Please use 'a' to push all, 'b' to push backend, 'f' to push frontend"
        fi
    fi
fi


