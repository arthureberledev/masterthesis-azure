# Deploy to Docker

docker build -t mt-aks-api .
docker tag mt-aks-api:latest arthureberle/mt-aks-api:latest
docker push arthureberle/mt-aks-api:latest
