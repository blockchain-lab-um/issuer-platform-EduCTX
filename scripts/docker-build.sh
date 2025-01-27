#!/bin/bash

# Build base image
docker build -t blockchain-lab-um/eductx-platform-base .

# Build issuer service
docker build -t blockchain-lab-um/eductx-platform-issuer-service apps/issuer-service

# Build authroziation service
docker build  -t blockchain-lab-um/eductx-platform-authorization-service apps/authorization-service

# Build dashboard
docker build -t blockchain-lab-um/eductx-platform-dashboard apps/dashboard

# Build platform backend
docker build -t blockchain-lab-um/eductx-platform-backend apps/eductx-platform-backend
