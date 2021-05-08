![CI](https://github.com/project-openubl/xsender-server-ui/workflows/CI/badge.svg)
[![codecov](https://codecov.io/gh/project-openubl/xsender-server-ui/branch/master/graph/badge.svg)](https://codecov.io/gh/project-openubl/xsender-server-ui)
[![xsender-server-ui](https://img.shields.io/endpoint?url=https://dashboard.cypress.io/badge/simple/8fs1cv/master&style=flat&logo=cypress)](https://dashboard.cypress.io/projects/8fs1cv/runs)
[![Docker Repository on Quay](https://quay.io/repository/projectopenubl/xsender-server-ui/status "Docker Repository on Quay")](https://quay.io/repository/projectopenubl/xsender-server-ui)

# XSender Server UI

## Iniciar el servidor en modo desarrollo

Clona el repositorio:

```shell
git clone https://github.com/project-openubl/xsender-server-ui
```

### Inicia las dependencias

La UI necesita de [xsender-server](https://github.com/project-openubl/xsender-server) y todas las dependencias del mismo:

- [PostgreSQL](https://www.postgresql.org/)
- [Keycloak](https://www.keycloak.org/)
- [Amazon S3](https://aws.amazon.com/s3/) o [Minio](https://min.io/)
- [Apache kafka](https://kafka.apache.org/)

Puedes el backend y todas sus dependencias utilizando `docker-compose.yml`:

```shell
docker-compose up
```

### Configura Kafka-connect

Una vez que todas las dependencias fueron iniciadas usando `docker-compose.yml` debes de configurar `Kafka connect`.

Atre un terminal y ejecuta el siguiente comando:

```shell
curl 'localhost:8083/connectors/' -i -X POST -H "Accept:application/json" \
-H "Content-Type:application/json" \
-d '{
   "name":"postgresql-connector",
   "config":{
      "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
      "tasks.max": "1",
      "database.hostname": "xsender-db",
      "database.port": "5432",
      "database.user": "xsender_username",
      "database.password": "xsender_password",
      "database.dbname": "xsender_db",
      "database.server.name": "dbserver1",
      "schema.include.list": "public",
      "table.include.list": "public.outboxevent",
      "tombstones.on.delete": "false",
      "transforms": "outbox",
      "transforms.outbox.type": "io.debezium.transforms.outbox.EventRouter",
      "transforms.outbox.table.fields.additional.placement": "type:header:eventType",
      "transforms.outbox.route.topic.replacement": "outbox.event.${routedByValue}",
      "transforms.outbox.table.field.event.timestamp": "timestamp",
      "key.converter": "org.apache.kafka.connect.json.JsonConverter",
      "key.converter.schemas.enable": "false",
      "value.converter": "org.apache.kafka.connect.json.JsonConverter",
      "value.converter.schemas.enable": "false"
   }
}'
```

### Inicia el servidor

Inicia el servidor en modo desarrollador

```shell script
yarn install
yarn start
```
