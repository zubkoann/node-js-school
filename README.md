# Node - Koa - Typescript Project

## How to start

```
npm i
docker-compose up -d
npm run watch-server
```

You have to use the following Auth token:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.zAIPIL0eT3YqDoXgIJ2hHPN7oJBeJ5_YHQk6pMdq6RA     
```


## Useful information

[![NPM version](https://img.shields.io/npm/v/node-typescript-koa-rest.svg)](https://www.npmjs.com/package/node-typescript-koa-rest)
[![Dependency Status](https://david-dm.org/javieraviles/node-typescript-koa-rest.svg)](https://david-dm.org/javieraviles/node-typescript-koa-rest)


The main purpose of this repository is to build a good project setup and workflow for writing a Node api rest in TypeScript using KOA and an SQL DB.

Koa is a new web framework designed by the team behind Express, which aims to be a smaller, more expressive, and more robust foundation for web applications and APIs. Through leveraging generators Koa allows you to ditch callbacks and greatly increase error-handling. Koa does not bundle any middleware within core, and provides an elegant suite of methods that make writing servers fast and enjoyable.

AVAILABLE ENDPOINTS

| method             | resource         | description                                                                                    |
|:-------------------|:-----------------|:-----------------------------------------------------------------------------------------------|
| `GET`              | `/`              | Simple hello world response                                                                    |
| `GET`              | `/jwt`           | Dummy endpoint to show how JWT info gets stored in ctx.state                                   |
| `GET`              | `/users`         | returns the collection of users present in the DB                                              |
| `GET`              | `/users/:id`     | returns the specified id user                                                                  |
| `POST`             | `/users`         | creates a user in the DB (object user to be includued in request's body)                       |
| `PUT`              | `/users/:id`     | updates an already created user in the DB (object user to be includued in request's body)      |
| `DELETE`           | `/users/:id`     | deletes a user from the DB (JWT token user ID must be the same as the user you want to delete) |

| `GET`              | `/users/:id/books`          | returns the collection of books by user present in the DB                                                                  |
| `POST`             | `/users/:id/books`          | creates a books of user in the DB (object book to be includued in request's body)                                                               |
| `PUT`              | `/users/:id/books/:bookId`  | updates an already created a books of user in the DB (object book to be includued in request's body)                                                               |
| `DELETE`           | `/users/:id/books/:bookId`  | deletes a books of user in the DB                                                             |


## Pre-reqs
To build and run this app locally you will need:
- Install [Node.js](https://nodejs.org/en/)

## Features:
 * Nodemon - server auto-restarts when code changes
 * Koa v2
 * TypeORM (SQL DB) with basic CRUD included
 * Class-validator - Decorator based entities validation
 * Docker-compose ready to go

## Included middleware:
 * koa-router
 * koa-bodyparser
 * Winston Logger
 * JWT auth koa-jwt
 * Helmet (security headers)
 * CORS

## Docker (optional)
A docker-compose file has been added to the project with a postgreSQL (already setting user, pass and dbname as the ORM config is expecting) and an ADMINER image (easy web db client).

It is as easy as go to the project folder and execute the command 'docker-compose up' once you have Docker installed, and both the postgreSQL server and the Adminer client will be running in ports 5432 and 8080 respectively with all the config you need to start playing around. 

If you use Docker natively, the host for the server which you will need to include in the ORM configuration file will be localhost, but if you were to run Docker in older Windows versions, you will be using Boot2Docker and probably your virtual machine will use your ip 192.168.99.100 as network adapter. This mean your database host will be the aforementioned ip and in case you want to access the web db client you will also need to go to http://19.168.99.100/8080

## Setting up the Database - ORM
This API is prepared to work with an SQL database, using [TypeORM](https://github.com/typeorm/typeorm). In this case we are using postgreSQL, and that is why in the package.json 'pg' has been included. If you where to use a different SQL database remember to install the correspondent driver.

The ORM configuration and connection to the database can be specified in the file 'ormconfig.json'. Here is directly in the connection to the database in 'server.ts' file because a environment variable containing databaseUrl is being used to set the connection data. This is prepared for Heroku, which provides a postgres-string-connection as env variable. In local is being mocked with the docker local postgres as can be seen in ".example.env"

It is importante to notice that, when serving the project directly with *.ts files using ts-node,the configuration for the ORM should specify the *.ts files path, but once the project is built (transpiled) and run as plain js, it will be needed to change it accordingly to find the built js files:

```
"entities": [
      "dist/entity/**/*.js"
   ],
   "migrations": [
      "dist/migration/**/*.js"
   ],
   "subscribers": [
      "dist/subscriber/**/*.js"
   ]
```

Notice that if NODE_ENV is set to development, the ORM config won't be using SSL to connect to the DB. Otherwise it will.

```
createConnection({
    ...
    extra: {
        ssl: config.DbSslConn, // if not development, will use SSL
    }
 })
```

You can find an implemented **CRUD of the entity user** in the correspondent controller controller/user.ts and its routes in routes.ts file.

## Entities validation
This project uses the library class-validator, a decorator-based entity validation, which is used directly in the entities files as follows:
```
export class User {
    @Length(10, 100) // length of string email must be between 10 and 100 characters
    @IsEmail() // the string must comply with an standard email format
    @IsNotEmpty() // the string can't be empty
    email: string;
}
```
Once the decorators have been set in the entity, you can validate from anywhere as follows:
```
const user = new User();
user.email = "avileslopez.javier@gmail"; // should not pass, needs the ending .com to be a valid email

validate(user).then(errors => { // errors is an array of validation errors
    if (errors.length > 0) {
        console.log("validation failed. errors: ", errors); // code will get here, printing an "IsEmail" error
    } else {
        console.log("validation succeed");
    }
});
```

For further documentation regarding validations see [class-validator docs](https://github.com/typestack/class-validator).


## Environment variables
Create a .env file (or just rename the .example.env) containing all the env variables you want to set, dotenv library will take care of setting them. This project is using three variables at the moment:

 * PORT -> port where the server will be started on, Heroku will set this env variable automatically
 * NODE_ENV -> environment, development value will set the logger as debug level, also important for CI. In addition will determine if the ORM connects to the DB through SSL or not.
 * JWT_SECRET -> secret value, JWT tokens should be signed with this value
 * DATABASE_URL -> DB connection data in connection-string format.

## Getting TypeScript
TypeScript itself is simple to add to any project with `npm`.
```
npm install -D typescript
```
If you're using VS Code then you're good to go!
VS Code will detect and use the TypeScript version you have installed in your `node_modules` folder. 
For other editors, make sure you have the corresponding [TypeScript plugin](http://www.typescriptlang.org/index.html#download-links). 

## Project Structure
The most obvious difference in a TypeScript + Node project is the folder structure.
TypeScript (`.ts`) files live in your `src` folder and after compilation are output as JavaScript (`.js`) in the `dist` folder.

The full folder structure of this app is explained below:

> **Note!** Make sure you have already built the app using `npm run build`

| Name | Description |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| **dist**                 | Contains the distributable (or output) from your TypeScript build. This is the code you ship  |
| **node_modules**         | Contains all your npm dependencies                                                            |
| **src**                  | Contains your source code that will be compiled to the dist dir                               |
| **src**/server.ts        | Entry point to your KOA app                                                                   |
| package.json             | File that contains npm dependencies as well as [build scripts](#what-if-a-library-isnt-on-definitelytyped)                          |
| docker-compose.yml       | Docker PostgreSQL and Adminer images in case you want to load the db from Docker              |
| tsconfig.json            | Config settings for compiling server code written in TypeScript                               |
| tslint.json              | Config settings for TSLint code style checking                                                |
| .example.env             | Env variables file example to be renamed to .env                                              |

## Configuring TypeScript compilation
TypeScript uses the file `tsconfig.json` to adjust project compile options.
Let's dissect this project's `tsconfig.json`, starting with the `compilerOptions` which details how your project is compiled. 

```json
    "compilerOptions": {
        "module": "commonjs",
        "target": "es2017",
        "lib": ["es6"],
        "moduleResolution": "node",
        "sourceMap": true,
        "outDir": "dist",
        "baseUrl": ".",
        "experimentalDecorators": true,
        "emitDecoratorMetadata": true,  
        }
    },
```

| `compilerOptions` | Description |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `"module": "commonjs"`             | The **output** module type (in your `.js` files). Node uses commonjs, so that is what we use            |
| `"target": "es2017"`               | The output language level. Node supports ES2017, so we can target that here                               |
| `"lib": ["es6"]`                   | Needed for TypeORM.                                             |
| `"moduleResolution": "node"`       | TypeScript attempts to mimic Node's module resolution strategy. Read more [here](https://www.typescriptlang.org/docs/handbook/module-resolution.html#node)                             |
| `"sourceMap": true`                | We want source maps to be output along side our JavaScript.     |
| `"outDir": "dist"`                 | Location to output `.js` files after compilation                |
| `"baseUrl": "."`                   | Part of configuring module resolution.                          |
| `"experimentalDecorators": true`   | Needed for TypeORM. Allows use of @Decorators                   |
| `"emitDecoratorMetadata": true`    | Needed for TypeORM. Allows use of @Decorators                   |



The rest of the file define the TypeScript project context.
The project context is basically a set of options that determine which files are compiled when the compiler is invoked with a specific `tsconfig.json`.
In this case, we use the following to define our project context: 
```json
    "include": [
        "src/**/*"
    ]
```
`include` takes an array of glob patterns of files to include in the compilation.
This project is fairly simple and all of our .ts files are under the `src` folder.
For more complex setups, you can include an `exclude` array of glob patterns that removes specific files from the set defined with `include`.
There is also a `files` option which takes an array of individual file names which overrides both `include` and `exclude`.


## Running the build
All the different build steps are orchestrated via [npm scripts](https://docs.npmjs.com/misc/scripts).
Npm scripts basically allow us to call (and chain) terminal commands via npm.
This is nice because most JavaScript tools have easy to use command line utilities allowing us to not need grunt or gulp to manage our builds.
If you open `package.json`, you will see a `scripts` section with all the different scripts you can call.
To call a script, simply run `npm run <script-name>` from the command line.
You'll notice that npm scripts can call each other which makes it easy to compose complex builds out of simple individual build scripts.
Below is a list of all the scripts this template has available:


| Npm Script | Description |
| ------------------------- | ------------------------------------------------------------------------------------------------- |
| `start`                   | Does the same as 'npm run serve'. Can be invoked with `npm start`                                 |
| `build`                   | Full build. Runs ALL build tasks (`build-ts`, `tslint`, `copy-static-assets`)                     |
| `serve`                   | Runs node on `dist/server/server.js` which is the apps entry point                                |
| `watch-server`            | Nodemon, process restarts if crashes. Continuously watches `.ts` files and re-compiles to `.js`   |
| `build-ts`                | Compiles all source `.ts` files to `.js` files in the `dist` folder                               |
| `tslint`                  | Runs TSLint on project files                                                                      |
| `copy-static-assets`      | Calls script that copies JS libs, fonts, and images to dist directory                             |

# TSLint
TSLint is a code linter which mainly helps catch minor code quality and style issues.
TSLint is very similar to ESLint or JSLint but is built with TypeScript in mind.

## TSLint rules
Like most linters, TSLint has a wide set of configurable rules as well as support for custom rule sets.
All rules are configured through `tslint.json`.
In this project, we are using a fairly basic set of rules with no additional custom rules.
The settings are largely based off the TSLint settings that we use to develop TypeScript itself.

## Running TSLint
Like the rest of our build steps, we use npm scripts to invoke TSLint.
To run TSLint you can call the main build script or just the TSLint task.
```
npm run build   // runs full build including TSLint
npm run tslint  // runs only TSLint
```
Notice that TSLint is not a part of the main watch task.
It can be annoying for TSLint to clutter the output window while in the middle of writing a function, so I elected to only run it only during the full build.
If you are interesting in seeing TSLint feedback as soon as possible, I strongly recommend the [TSLint extension in VS Code]().


# Logging
Winston is designed to be a simple and universal logging library with support for multiple transports.

A "logger" middleware passing a winstonInstance has been created. Current configuration of the logger can be found in the file "logging.ts". It will log 'error' level to an error.log file and 'debug' or 'info' level (depending on NODE_ENV environment variable, debug if == development) to the console.

```
// Logger middleware -> use winston as logger (logging.ts with config)
app.use(logger(winston));
```

# Authentication - Security
The idea is to keep the API as clean as possible, therefore the auth will be done from the client using an auth provider such as Auth0. The client making requests to the API should include the JWT in the Authorization header as "Authorization: Bearer <jwt_token>". HS256 will be used as the secret will be known by both your api and your client and will be used to sign the token, so make sure you keep it hidden.

As can be found in the server.ts file, a JWT middleware has been added, passing the secret from an environment variable. The middleware will validate that every request to the routes below, MUST include a valid JWT signed with the same secret. The middleware will set automatically the payload information in ctx.state.user.

```
// JWT middleware -> below this line, routes are only reached if JWT token is valid, secret as env variable
app.use(jwt({ secret: config.jwtSecret }));
```
Go to the website [https://jwt.io/](https://jwt.io/) to create JWT tokens for testing/debugging purposes. Select algorithm HS256 and include the generated token in the Authorization header to pass through the jwt middleware.

Custom 401 handling -> if you don't want to expose koa-jwt errors to users:
```
app.use(function(ctx, next){
  return next().catch((err) => {
    if (401 == err.status) {
      ctx.status = 401;
      ctx.body = 'Protected resource, use Authorization header to get access\n';
    } else {
      throw err;
    }
  });
});
```

If you want to authenticate from the API, and you fancy the idea of an auth provider like Auth0, have a look at [jsonwebtoken — JSON Web Token signing and verification](https://github.com/auth0/node-jsonwebtoken)


## CORS
This boilerplate uses @koa/cors, a simple CORS middleware for koa. If you are not sure what this is about, click [here](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS).

```
// Enable CORS with default options
app.use(cors());
```
Have a look at [Official @koa/cors docs](https://github.com/koajs/cors) in case you want to specify 'origin' or 'allowMethods' properties.


## Helmet
This boilerplate uses koa-helmet, a wrapper for helmet to work with koa. It provides important security headers to make your app more secure by default. 

Usage is the same as [helmet](https://github.com/helmetjs/helmet). Helmet offers 11 security middleware functions (clickjacking, DNS prefetching, Security Policy...), everything is set by default here.

```
// Enable helmet with default options
app.use(helmet());
```

Have a look at [Official koa-helmet docs](https://github.com/venables/koa-helmet) in case you want to customize which security middlewares are enabled.


# Dependencies
Dependencies are managed through `package.json`.
In that file you'll find two sections:
## `dependencies`

| Package                         | Description                                                           |
| ------------------------------- | --------------------------------------------------------------------- |
| dotenv                          | Loads environment variables from .env file.                           |
| koa                             | Node.js web framework.                                                |
| koa-bodyparser                  | A bodyparser for koa.                                                 |
| koa-jwt                         | Middleware to validate JWT tokens.                                    |
| koa-router                      | Router middleware for koa.                                            |
| koa-helmet                      | Wrapper for helmet, important security headers to make app more secure| 
| @koa/cors                       | Cross-Origin Resource Sharing(CORS) for koa                           |
| pg                              | PostgreSQL driver, needed for the ORM.                                |
| reflect-metadata                | Used by typeORM to implement decorators.                              |
| typeorm                         | A very cool SQL ORM.                                                  |
| winston                         | Logging library.                                                      |
| class-validator                 | Decorator based entities validation.                                  |
| pg-connection-string            | Parser for database connection string                                 |


## `devDependencies`

| Package                         | Description                                                           |
| ------------------------------- | --------------------------------------------------------------------- |
| @types                          | Dependencies in this folder are `.d.ts` files used to provide types   |
| nodemon                         | Utility that automatically restarts node process when it crashes      |
| ts-node                         | Enables directly running TS files. Used to run `copy-static-assets.ts`|
| tslint                          | Linter (similar to ESLint) for TypeScript files                       |
| typescript                      | JavaScript compiler/type checker that boosts JavaScript productivity  |
| shelljs                         | Portable Unix shell commands for Node.js                              |

To install or update these dependencies you can use `npm install` or `npm update`.


## Changelog

### 1.4.1
- Fix -> After updating winston to 3.0.0, it was throwing an error when logging errors into file
- Fix -> Config in config.ts wasn't implementing IConfig interface

### 1.4.0
- Dotenv lib updated, no changes needed (they are dropping node4 support)
- Class-validator lib updated, no chages needed (cool features added like IsPhoneNumber or custom context for decorators)
- Winston lib updated to 3.0.0, some amendments needed to format the console log. Removed the @types as Winston now supports Typescript natively!
- Some devDependencies updated as well

### 1.3.0
- CORS added
- Syntax full REST
- Some error handling improvement

### 1.2.0
- Heroku deployment added

### 1.1.0
- Added Helmet for security
- Some bad practices await/async fixed
