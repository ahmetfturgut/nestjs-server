# Medium Level NestJS Project

The project is an example of a medium-level application developed using NestJS. The project includes the following features:

## Directory structure

### Overview

Project `src` structure directories.

```
src/
├─ app/
│  ├─ _common/
|  |  ├─ api/
|  |  ├─ enum/
|  |  ├─ model/
|  |  ├─ repository/
|  |  |  ├─ repository.ts
|  |  ├─ service/
|  |  |  ├─ service.ts
│  ├─ auth/
│  ├─ ...
│  ├─ email/
│  ├─ ...
│  ├─ user/
|  |  ├─ dto
|  |  ├─ enum
|  |  ├─ test
|  |  ├─ user.controller.ts
|  |  ├─ user.model.ts
|  |  ├─ user.module.ts
|  |  ├─ user.repository.ts
|  |  ├─ user.service.ts
│  ├─ app.module.ts
├─ core/
│  ├─ decorators/
|  |  ├─ authenticated-user.decorator.ts
|  |  ├─ public.decorator.ts
|  |  ├─ user-type.decorator.ts
│  ├─ environment/
|  |  ├─ config.ts
│  ├─ filters/
|  |  ├─ all-exception.filter.ts
|  |  ├─ http.exception.ts
│  ├─ guards/
|  |  ├─ jwt-auth.guard.ts
|  |  ├─ user-type.guard.ts
│  ├─ middlewares/
|  |  ├─ logger.middleware.ts
│  ├─ pipes/
|  |  ├─ validation.pipe.ts
│  ├─ strategy/
|  |  ├─ jwt.strategy.ts
│  ├─ tools/
   │  ├─ crypto.util.ts
│  ├─ app.module.ts
├─ mail.ts
└─
```
## Installation and Setup

Install project dependencies using the following command.
```bash
npm install
```
Then, create an example .env file and add the necessary environmental variables before running the project.

```bash
cp example.env .env
```
## Running
Start the project with the following command

```bash
npm run start
```
## Testing
Use the following command to test the project.
```bash
npm run test
```
## Usage
After successfully starting the project, you can access the API at [http://localhost:3000](http://localhost:3000).

## Logging
Learn more about logging using [Nest-Winston](https://docs.nestjs.com/techniques/logger#winston).

## Validation
Request data validation using [Class-Validator](https://github.com/typestack/class-validator).

## JWT (JSON Web Token)
Explore authentication and authorization using [JWT (JSON Web Token)](https://docs.nestjs.com/security/authentication#json-web-token-authentication).

## Swagger
Get detailed information about API documentation using [Swagger](https://docs.nestjs.com/openapi/introduction).

## Middleware
Understand the concept of middleware using [Middleware](https://docs.nestjs.com/middleware).

## Exception Filters
Learn about exception filters using [Exception Filters](https://docs.nestjs.com/exception-filters).

## Pipes
Understand the concept of pipes using [Pipes](https://docs.nestjs.com/pipes).

## Guards
Explore the concept of guards using [Guards](https://docs.nestjs.com/guards).

## Interceptors
Learn about interceptors using [Interceptors](https://docs.nestjs.com/interceptors).

## Custom Decorators
Discover custom decorators using [Custom Decorators](https://docs.nestjs.com/custom-decorators).

## Inspirations
- [NestJS DOCUMENTATION ](https://docs.nestjs.com)
- [Kamil Mysliwiec](https://twitter.com/kammysliwiec)






