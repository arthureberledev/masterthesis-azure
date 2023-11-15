# Tutorial

https://learn.microsoft.com/en-us/azure/mysql/flexible-server/quickstart-create-bicep

## Create Resource Group

```
az group create `
  --name mt-flexdb-rg `
  --location germanywestcentral
```

```
az mysql flexible-server create `
  --location germanywestcentral `
  --resource-group mt-flexdb-rg `
  --name mt-db-server `
  --database-name mt_db `
  --admin-user mt_user `
  --admin-password secretpassword `
  --sku-name Standard_D2ds_v4 `
  --tier GeneralPurpose `
  --version 8.0.21 `
  --public-access 0.0.0.0 `
  --storage-size 32 `
  --high-availability Disabled `
  --zone 1 `
  --storage-auto-grow Enabled `
  --iops 500 `
  --auto-scale-iops Enabled
```

## Get Connection Information

```
az mysql flexible-server show --resource-group mt-flexdb-rg --name mt-sqlserver
```

## Connect to the Server (CloudShell)

```
az mysql flexible-server connect -n mt-sqlserver -u masterthesis -p secretpassword -d mt_db
```

## Create Table (CloudShell)

```
USE mt_db;
```

```
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) NOT NULL
);
```

→ Dashboard → Networking → Allow public access from any Azure service within Azure to this server
→ Dashboard → Server parameters → `require_secure_transport` → `OFF`

## Cleanup

```
az group delete --name mt-flexdb-rg --yes
```
