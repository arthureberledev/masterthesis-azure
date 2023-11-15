# Tutorial

https://learn.microsoft.com/en-us/azure/aks/learn/quick-kubernetes-deploy-bicep

# Create Resource Group

`az group create --name mt-aks-rg --location germanywestcentral`

# Create SSH Key (Nur beim 1. Mal in CloudShell)

`az sshkey create --name mt-aks-ssh-key --resource-group mt-aks-rg`
`ssh-keygen -t rsa -b 4096`

# Cluster Deployment

→ SSH Key aus dem Azure Dashboard kopieren

```
az deployment group create `
    --resource-group mt-aks-rg `
    --template-file main.bicep `
    --parameters `
        dnsPrefix=mt-aks `
        linuxAdminUsername=masterthesis `
        sshRSAPublicKey='ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDdBgNhJM+JfGjWp5HZEmbE/cHyX/Hr2Lvfl+NLQBUPhPyqtiiFhI20nP7vtg1dc9LyowUE+llqpx/Tf3f85DBdJzolAVCIIw6hb7WlD9hmZ1ztMtvT2nYcFH7KbLEto6RbX0CH0NOw7lqNQ+rtAQsclnnfM+s+2+bG658WYlrxsUMlFDX6TH5/lxgBt6o2OMwtmq8eNopaA8VgZXPSFEVX5p8y2nJG63hZDku692YZ9TbMsMEXwXlt1WSn3iQNt5G1Yt4+HkyLlk+zkmgkmeMOh3BpT7OuRWz8VUr5RK/m60ya0kXDdU2J4nJuhH/+YHd3HyrIgSHqkdGCd4u785emKgCRzXlYZxDFhEdhz4kT4V5jW+jC619U+Jru/feLW5MBESyrvsdk9/uUWCdxYa74FcO+C1ZCIw+J4F4py0bn4habxrdjd3nXNCIxrPcismsk0+80qinUHY+d84AMfBYdRe3RDpkTXXqLGSWDaHXTv7pbsfKaJc/qlh3rW62bQO0= generated-by-azure'
```

## Set up kubectl

`az aks get-credentials --resource-group mt-aks-rg --name aks101cluster`

## Deploy api to the pods

`kubectl apply -f api.yaml`

`kubectl get service mt-aks-api`

→ `EXTERNAL-IP`

## Enable Auto Scale in Azure Dashboard

→ aks101cluster → Node pools → Scale method

# Clean Up

`az group delete --name mt-aks-rg --yes`
