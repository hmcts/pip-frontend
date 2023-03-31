# pip-frontend

## Overview
`pip-frontend` is a microservice that serves the frontend of the Court and Tribunal Hearings Service (known as CaTH hereafter). This project was formerly known as the Publications and Information Project within HMCTS.

The frontend uses a [Node.js](https://nodejs.org/en) runtime environment, using [Express.js](https://expressjs.com/) as the web application framework.
Our templating engine is [nunjucks](https://mozilla.github.io/nunjucks/).

It is connected to several other microservices in production:
| Microservice  | Summary |
| ------------- | ------------- |
|pip-data-management (`port:8090`)|Communicates with [postgres](https://www.postgresql.org/) and [Azure Blob Storage](https://azure.microsoft.com/en-us/products/storage/blobs) and controls file storage, file ingestion, reference data and validation|
|pip-subscription-management (`port:4550`)|Handles all operations related to subscriptions, including all CRUD operations and the triggering of the fulfilment process.|
|pip-channel-management(`port:8181`)|Handles operations related to retrieving subscription channels, and the generation of alternative publishing formats used throughout the subscription process (such as PDFs).|
|pip-publication-services(`port:8081`)|Handles operations related to sending of notification emails to verified users, admin users and publication subscribers using [GOV.UK Notify](https://www.notifications.service.gov.uk/), as well as forwarding of publications to third-party publishers.|
|pip-account-management(`port:6969`)|Handles operations related to accounts, including interaction with Azure B2C for PI_AAD users. It also manages the audit functionality.|


## Getting Started

### Prerequisites
##### General

Running the application requires the following tools to be installed in your environment:

- [Node.js](https://nodejs.org/) v16.0.0 to v19.x.x (last tested on v19.8.1)
- [yarn](https://yarnpkg.com/) v3+
- [Docker](https://www.docker.com)

##### Nice to haves
- HTTP client of some description (e.g. [Curl](https://github.com/curl/curl)). You could also use any web browser (e.g. [Mozilla Firefox](https://www.mozilla.org/en-GB/firefox/new/), [Google Chrome](https://www.google.com/intl/en_uk/chrome/)) 
- The service won't run particularly well without the attached services, so it's a good idea to have those running as well. `pip-account-management` and `pip-data-management` 


### Installation
#### Setup
- Clone the repository
- Ensure all required [environment variables](#environment-variables) have been set.
- Use the terminal command `yarn install` to install all dependencies.
- Use `yarn run build` to build the application.
#### Running the application
- Use `yarn start` to start the application (defaults to port `8080`)

### Configuration

### Authentication

Some of the pages within this app are secured via authentication.

There are two modes for authentication:

1. OIDC.
2. Custom Strategy.

The OIDC connect strategy integrates with Azure. When users try to access an authenticated page,
they will be presented with the logon screen.

To use this strategy, set the 'OIDC' environment variable to 'true' when starting up the app.

Alternatively, users can use the Custom Strategy which is the default. Rather than integrating with Azure, user will
need to set up mocked user via mock-session screens. See the Authentication.ts file for details on how this
is done

Here is a list of environment variables needed to launch the app:

| Name                     | Value                                                                                         |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| CLIENT_SECRET            | This is used to communicate with Azure (OIDC mode only)                                       |
| SESSION_SECRET           | A random string                                                                               |
| OIDC                     | (Optional) - Set to 'true' to enable OIDC mode.                                               |
| FRONTEND_URL             | (Optional) - This is the host that you are redirected back to from Azure. Default is staging. |
| CFT_REJECTED_ROLES_REGEX | (Optional) - If you want to override the rejected roles regex for CFT.                        |

Passing these variables can be done via

```bash
$ (Linux) export CLIENT_SECRET=<VALUE_GOES_HERE>
$ (Windows) set CLIENT_SECRET<VALUE_GOES_HERE>
```

or, in intellij you can pass them in the Run Configuration.

### Running the application

Install dependencies by executing the following command:

```bash
$ yarn install
```

Bundle:

```bash
$ yarn build
```

Start Redis Locally:
To connect locally run bellow command and rename connection string from `rediss` to `redis` in [cacheManager.ts](src/main/cacheManager.ts) (line 13)

```bash
$ docker run -d -p 6379:6379 redis
```

Run:

```bash
$ yarn start
```

or Run Dev mode:

```bash
$ yarn start:dev
```

The applications's home page will be available at https://localhost:8080

### Running with Docker

Create docker image:

```bash
  docker-compose build
```

Run the application by executing the following command:

```bash
  docker-compose up
```

This will start the frontend container exposing the application's port
(set to `8080` in this template app).

In order to test if the application is up, you can visit https://localhost:8080 in your browser.

## Developing

### Code style

We use [ESLint](https://github.com/typescript-eslint/typescript-eslint)
alongside [sass-lint](https://github.com/sasstools/sass-lint)

Running the linting with auto fix:

```bash
$ yarn lint --fix
```

### Running the tests

This template app uses [Jest](https://jestjs.io//) as the test engine.

You can run unit & route tests by executing the following command:

```bash
$ yarn test
```

You can run unit tests by executing the following command:

```bash
$ yarn test:unit
```

You can run route tests by executing the following command:

```bash
$ yarn test:routes
```

You can run accessibility tests by executing the following command:

```bash
$ yarn test:a11y
```

Make sure all the paths in your application are covered by accessibility tests (see [a11y.ts](src/test/a11y/a11y.ts)).

Running end-to-end tests:

There are two ways to run E2E tests. Against a locally running version of the application, and remotely against the branch.

If running locally, stand up the application and run the following:

```bash
$ yarn test:functional-dev
```

Make sure to have application running in developer mode first while testing locally, otherwise tests will fail. To test in development mode run: `yarn start:dev`

If running against a remote instance (e.g a PR), then the following env variables need to be set:

| Name                     | Value                                                                                       |
| ------------------------ | ------------------------------------------------------------------------------------------- |
| TEST_URL                 | The URL where the instance you would like to test against is hosted (https://<host>:<port>) |
| (Optional) USE_PROTOTYPE | If the instance uses the prototype, then this flag must be set to TRUE                      |

The following command is run by the jenkins pipeline, although can be run locally, it will run in HEADLESS mode.

```bash
$ yarn test:functional
```

### Security

#### CSRF prevention

[Cross-Site Request Forgery](https://github.com/pillarjs/understanding-csrf) prevention has already been
set up in this template, at the application level. However, you need to make sure that CSRF token
is present in every HTML form that requires it. For that purpose you can use the `csrfProtection` macro,
included in this template app. Your njk file would look like this:

```
{% from "macros/csrf.njk" import csrfProtection %}
...
<form ...>
  ...
    {{ csrfProtection(csrfToken) }}
  ...
</form>
...
```

#### Helmet

This application uses [Helmet](https://helmetjs.github.io/), which adds various security-related HTTP headers
to the responses. Apart from default Helmet functions, following headers are set:

-   [Referrer-Policy](https://helmetjs.github.io/docs/referrer-policy/)
-   [Content-Security-Policy](https://helmetjs.github.io/docs/csp/)

There is a configuration section related with those headers, where you can specify:

-   `referrerPolicy` - value of the `Referrer-Policy` header

Here's an example setup:

```json
    "security": {
      "referrerPolicy": "origin",
    }
```

Make sure you have those values set correctly for your application.

### Healthcheck

The application exposes a health endpoint (https://localhost:8080/health), created with the use of
[Nodejs Healthcheck](https://github.com/hmcts/nodejs-healthcheck) library. This endpoint is defined
in [health.ts](src/main/routes/health.ts) file. Make sure you adjust it correctly in your application.
In particular, remember to replace the sample check with checks specific to your frontend app,
e.g. the ones verifying the state of each service it depends on.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
