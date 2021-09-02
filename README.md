![CI](https://github.com/project-openubl/ublhub-ui/workflows/CI/badge.svg)
[![codecov](https://codecov.io/gh/project-openubl/ublhub-ui/branch/master/graph/badge.svg)](https://codecov.io/gh/project-openubl/ublhub-ui)
[![ublhub-ui](https://img.shields.io/endpoint?url=https://dashboard.cypress.io/badge/simple/8fs1cv/master&style=flat&logo=cypress)](https://dashboard.cypress.io/projects/8fs1cv/runs)
[![Docker Repository on Quay](https://quay.io/repository/projectopenubl/ublhub-ui/status "Docker Repository on Quay")](https://quay.io/repository/projectopenubl/ublhub-ui)

# XSender Server UI

## Iniciar el servidor en modo desarrollo

Clona el repositorio:

```shell
git clone https://github.com/project-openubl/ublhub-ui
```

### Inicia las dependencias

La UI necesita de [ublhub](https://github.com/project-openubl/ublhub) y todas las dependencias del mismo:

- [PostgreSQL](https://www.postgresql.org/)
- [Keycloak](https://www.keycloak.org/)
- [Amazon S3](https://aws.amazon.com/s3/) o [Minio](https://min.io/)
- [ActiveMQ Artemis](https://activemq.apache.org/components/artemis/)

Puedes el backend y todas sus dependencias utilizando `docker-compose.yml`:

```shell
docker-compose up
```

### Inicia el servidor

Inicia el servidor en modo desarrollador

```shell script
yarn install
yarn start
```

Podrás abrir el servidor en http://localhost:3000

- Usuario: admin
- Password: admin
