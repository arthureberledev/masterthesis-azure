# Tutorial

https://learn.microsoft.com/en-us/azure/aks/learn/quick-kubernetes-deploy-cli

# Deploy AKS

## Create Resource Group

```
az group create `
    --name mt-aks-rg `
    --location germanywestcentral
```

## Create an AKS cluster

```
az aks create `
    --resource-group mt-aks-rg `
    --name mt-aks-cluster `
    --location germanywestcentral `
    --dns-name-prefix mt-aks `
    --node-vm-size standard_d2ds_v4 `
    --admin-username mt-user `
    --ssh-key-value 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDdBgNhJM+JfGjWp5HZEmbE/cHyX/Hr2Lvfl+NLQBUPhPyqtiiFhI20nP7vtg1dc9LyowUE+llqpx/Tf3f85DBdJzolAVCIIw6hb7WlD9hmZ1ztMtvT2nYcFH7KbLEto6RbX0CH0NOw7lqNQ+rtAQsclnnfM+s+2+bG658WYlrxsUMlFDX6TH5/lxgBt6o2OMwtmq8eNopaA8VgZXPSFEVX5p8y2nJG63hZDku692YZ9TbMsMEXwXlt1WSn3iQNt5G1Yt4+HkyLlk+zkmgkmeMOh3BpT7OuRWz8VUr5RK/m60ya0kXDdU2J4nJuhH/+YHd3HyrIgSHqkdGCd4u785emKgCRzXlYZxDFhEdhz4kT4V5jW+jC619U+Jru/feLW5MBESyrvsdk9/uUWCdxYa74FcO+C1ZCIw+J4F4py0bn4habxrdjd3nXNCIxrPcismsk0+80qinUHY+d84AMfBYdRe3RDpkTXXqLGSWDaHXTv7pbsfKaJc/qlh3rW62bQO0= generated-by-azure' `
    --tier standard `
    --enable-cluster-autoscaler `
    --min-count 3 `
    --max-count 10 `
    --load-balancer-sku standard `
    --enable-addons monitoring
```

# Deploy API

## Set up kubectl

```
az aks get-credentials `
    --resource-group mt-aks-rg `
    --name mt-aks-cluster
```

## Integrate container into cluster

kubectl apply -f api.yaml
kubectl get service mt-aks-api
kubectl delete deployment mt-aks-api
kubectl delete service mt-aks-api

→ EXTERNAL-IP

## Clean Up

```
az group delete `
    --name mt-aks-rg `
    --yes
```
