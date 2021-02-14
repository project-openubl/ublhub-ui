![CI](https://github.com/project-openubl/xsender-server-ui/workflows/CI/badge.svg)
[![codecov](https://codecov.io/gh/project-openubl/xsender-server-ui/branch/master/graph/badge.svg)](https://codecov.io/gh/project-openubl/xsender-server-ui)
[![xsender-server-ui](https://img.shields.io/endpoint?url=https://dashboard.cypress.io/badge/simple/8fs1cv/master&style=flat&logo=cypress)](https://dashboard.cypress.io/projects/8fs1cv/runs)
[![Docker Repository on Quay](https://quay.io/repository/projectopenubl/xsender-server-ui/status "Docker Repository on Quay")](https://quay.io/repository/projectopenubl/xsender-server-ui)

# XSender Server UI

UI application for the xsender-server project.

## Development

To start in development mode follow the next steps:

### Start Keycloak

You can start Keycloak using Docker or Postmam:

```shell
docker run -p 8180:8080 -e KEYCLOAK_USER=admin -e KEYCLOAK_PASSWORD=admin quay.io/projectopenubl/openubl-keycloak-theme
```

Then you need to create a realm and configure it. You can import the realm using the file `openubl-realm.json`.

### Start the backend DB

Execute:

```shell
docker run -p 5432:5432 -e POSTGRES_USER=xsender_username -e POSTGRES_PASSWORD=xsender_password -e POSTGRES_DB=xsender_db postgres:13.1
```

### Star the backend

You need to clone the backend server and then start it using:

```shell
./mvnw quarkus:dev
```

### Start the UI

You can start the UI executing:

```shell
yarn start
```

You should be able to open http://localhost:3000 and start working on the UI.
