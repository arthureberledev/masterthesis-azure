# Tutorial

https://learn.microsoft.com/en-us/azure/mysql/flexible-server/quickstart-create-bicep

# With Azure CLI and Bicep

## Create Resource Group

```
az group create --name mt-flexdb-rg --location germanywestcentral
```

## Database Deployment

```
az deployment group create --resource-group mt-flexdb-rg --template-file main.bicep
```

```
az deployment group create --resource-group mt-flexdb-rg --template-file main.bicep --parameters resourceNamePrefix=mt- administratorLogin=masterthesis administratorLoginPassword=secretpassword
```

```
az resource list --resource-group mt-flexdb-rg
```

```
az mysql flexible-server connect -n mt-sqlserver -u mt-user -p secretpassword -d mt-mysqldb
```

```
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) NOT NULL
);
```

## Cleanup

```
az group delete --name mt-flexdb-rg --yes
```

---

# Only Azure CLI

## Create Resource Group

```
az group create --name mt-flexdb-rg --location germanywestcentral
```

```
az mysql flexible-server create `
  --location germanywestcentral `
  --resource-group mt-flexdb-rg `
  --name mt-sqlserver `
  --admin-user masterthesis `
  --admin-password secretpassword `
  --sku-name Standard_D2ds_v4 `
  --tier GeneralPurpose `
  --version 8.0.21 `
  --public-access All `
  --storage-size 32 `
  --high-availability Disabled `
  --zone 1 `
  --storage-auto-grow Enabled `
  --iops 500
```

## Output

```
Checking the existence of the resource group 'mt-flexdb-rg'...
Resource group 'mt-flexdb-rg' exists ? : True
IOPS is 500 which is either your input or free(maximum) IOPS supported for your storage size and SKU.
Creating MySQL Server 'mt-sqlserver' in group 'mt-flexdb-rg'...
Your server 'mt-sqlserver' is using sku 'Standard_D2ds_v4' (Paid Tier). Please refer to https://aka.ms/mysql-pricing for pricing details
Configuring server firewall rule to accept connections from '0.0.0.0' to '255.255.255.255'...
Creating MySQL database 'flexibleserverdb'...
Make a note of your password. If you forget, you would have to reset your password with'az mysql flexible-server update -n mt-sqlserver -g mt-flexdb-rg -p <new-password>'.
Try using az 'mysql flexible-server connect' command to test out connection.
{
  "connectionString": "mysql flexibleserverdb --host mt-sqlserver.mysql.database.azure.com --user masterthesis --password=secretpassword",
  "databaseName": "flexibleserverdb",
  "firewallName": "AllowAll_2023-10-20_16-11-40",
  "host": "mt-sqlserver.mysql.database.azure.com",
  "id": "/subscriptions/1c15651c-7d30-4b9f-a9e8-38fea2acb6ba/resourceGroups/mt-flexdb-rg/providers/Microsoft.DBforMySQL/flexibleServers/mt-sqlserver",
  "location": "Germany West Central",
  "password": "secretpassword",
  "resourceGroup": "mt-flexdb-rg",
  "skuname": "Standard_D2ds_v4",
  "username": "masterthesis",
  "version": "8.0.21"
}
```

<!--
## Create a database

```
az mysql flexible-server db create --resource-group mt-flexdb-rg --server-name mt-sqlserver --database-name mt_mysql_db
```
-->

## Get Connection Information

```
az mysql flexible-server show --resource-group mt-flexdb-rg --name mt-sqlserver
```

## Connect to the Server (CloudShell)

```
az mysql flexible-server connect -n mt-sqlserver -u masterthesis -p secretpassword -d flexibleserverdb
```

## Create Table (CloudShell)

```
USE flexibleserverdb;
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
