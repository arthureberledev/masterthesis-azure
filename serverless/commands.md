# Tutorial

https://learn.microsoft.com/en-us/azure/azure-functions/create-first-function-cli-typescript?tabs=linux%2Cazure-cli%2Cbrowser&pivots=nodejs-model-v4

## Create Resource Group

```
az group create --name mt-serverless-rg --location germanywestcentral
```

## Create Storage Account

```
az storage account create --name arthureberlestorage --location germanywestcentral --resource-group mt-serverless-rg --sku Standard_LRS --allow-blob-public-access false
```

Storage account name must be between 3 and 24 characters in length and use numbers and lower-case letters only. They must be unique.
The storage account is used to store important app data, sometimes including the application code itself. You should limit access from other apps and users to the storage account.

## Create Function App

```
az functionapp create --resource-group mt-serverless-rg --consumption-plan-location germanywestcentral --runtime node --runtime-version 18 --functions-version 4 --name mt-functions-app --storage-account arthureberlestorage
```

## Deploy Function to Azure

`npm run build`
`func azure functionapp publish mt-functions-app`

## Clean Up

```
az group delete --name mt-serverless-rg --yes
```
