#!/usr/bin/env bash

# Build the docker image
docker build -t home-monitoring .

# Save the image
docker save -o home-monitoring.tar home-monitoring

# Copy to the raspberry
scp home-monitoring.tar pi@192.168.1.150:/home/pi/home_images/

# Erase the image
rm home-monitoring.tar

# Inside the raspberry
#sudo docker load -i home-monitoring.tar
#sudo docker-compose up -d
