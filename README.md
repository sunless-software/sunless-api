# Sunless API

## Starting in Development

1 - To start the application in development mode, first you need to start the Docker container for the database. Make sure to create a `.env` file following the template defined in `env_example`.
Ensure that the _NODE_ENV_ variable is set to "development".

2 - Then run the following command to start the Postgres Docker container and execute the initial SQL scripts:

```bash
npm run db:dev:up
```

2 - Then run the following command to start the Postgres Docker container and execute the initial SQL scripts:

```bash
npm run db:dev:up
```

3 - Once the database has been initialized successfully, you can stop the process.

4 - From the root folder of the sunless-api project, run the following command to install the required dependencies:

```bash
npm i
```

5 - Finally, run the following command to start the project:

```bash
npm run dev
```

This should start both the Docker container with the database and the Node project with the API.

## Starting in Production

1 - To start the application in production mode, first make sure to create a `.env` file following the template defined in `env_example`. Ensure that _NODE_ENV_ is set to "production" and _POSTGRES_HOST_ is set to the name of the Docker service for the database (default is "postgres_prod").

2 - Run the following command to launch the application in production mode:

```bash
npm run prod
```

## Documentation

Once the application is running, you can find a documented list of all endpoints at: http://localhost:3002/api/v1/documentation

You also have a Postman collection available inside the postman folder.
