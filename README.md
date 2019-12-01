# MeetApp-Server [![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](https://github.com/paulowsantos/Meetapp/blob/master/LICENSE)


This is the back-end of the [MeetApp](https://github.com/paulowsantos/MeetApp-mobile). 

It's a RESTful API built with NodeJS + Express + PostgreSQL + MongoDB that receives all the data related to users and meetups and record/provide to the client all this data through a REST API. 

The main purpose of this API is to set up meetings. Meetups were selected by me just to give some context to the app. So, you can reuse all this code to set up meetings and use inside your own context (meetings, encounters or whatever!).

## About this Project

This project is part of my personal portfolio, so, I'll be happy if you could provide me any feedback about the project, code, structure or anything that you can report that could make me a better developer!

  
Email-me: paulowsantos@gmail.com

  

Connect with me at [LinkedIn](https://www.linkedin.com/in/paulo-wayner/)

  

Also, you can use this Project as you wish, be for study, be to make improvements or earn money with it!

  

It's free!

## Getting Started

### Prerequisites

To run this project in the development mode, you'll need to have a basic environment with NodeJS 10+ installed.

To use the database, you'll need to have PostgreSQL, MongoDB and Redis installed and running on your machine. You can use docker to run these databases.

### Installing

**Cloning the Repository**

```
$ git clone https://github.com/paulowsantos/Meetapp

$ cd Meetapp
```

**Installing dependencies**

```
$ yarn
```

_or_

```
$ npm install
```

**Creating .env file**

Refer to file [.env.example](https://github.com/paulowsantos/Meetapp/blob/master/.env.example) to fill up the remaining data and create a .env file with the same content.

**Run the migrations**

```
$ yarn sequelize db:migrate
```

### Running the Development environment

With all dependencies installed, the Database running and the environment properly configured, you can now run the server:

```
$ yarn dev
```

_or_

```
$ npm run dev
```

### Running the Queue server (for the email jobs)

```
$ yarn queue
```

_or_

```
$ npm run queue
```

## Routes

The base URL is: http://localhost:3333

### Users

- **Create a new user.**

| ENDPOINT | Method | Params | URL Params | Success Response | Error Response
|--|--|--|--|--|--|
| /users| `POST`  |`{`<br />`name: ,`<br />`email: ,`<br />`password: `<br />`}`|-|**Code:** 200 - OK<br />**Content:** <br />`{`<br /> `id: ,`<br />`name: ,`<br />`email: ,`<br />`provider: `<br />`}`|<br />**Code:** 400 - BAD REQUEST<br />**Content:** `{ error:  "User already exists." }`<br /><br />or<br /><br />**Code:** 400 - BAD REQUEST<br />**Content:** `{ error:  "Validation fails." }`<br /><br />or<br /><br />**Code:** 500 - INTERNAL SERVER ERROR<br />**Content:** `{ error:  <A Message with a description of the Error> }`
<br />

- **Update a user information.**

| ENDPOINT | Method | Params | URL Params | Success Response | Error Response
|--|--|--|--|--|--|
| /users| `PUT`  |`{`<br />`name: ,`<br />`email: ,`<br />`oldPassword: ,`<br />`password: ,`<br />`confirmPassword: ,`<br />`provider: ,`<br />`avatar_id: `<br />`}`|-|**Code:** 200 - OK<br />**Content:** <br />`{`<br />`user : {`<br /> `id: ,`<br />`name: ,`<br />`email: ,`<br />`provider: `<br />`}`<br />`}`|<br />**Code:** 400 - BAD REQUEST<br />**Content:** `{ error:  "User already exists." }`<br /><br />or<br /><br />**Code:** 401 - UNAUTHORIZED<br />**Content:** `{ error:  "Password does not match." }`<br /><br />or<br /><br />**Code:** 400 - BAD REQUEST<br />**Content:** `{ error:  "Validation fails." }`<br /><br />or<br /><br />**Code:** 500 - INTERNAL SERVER ERROR<br />**Content:** `{ error:  <A Message with a description of the Error> }`
<br />

### Session

- **Create a new session.**

| ENDPOINT | Method | Params | URL Params | Success Response | Error Response
|--|--|--|--|--|--|

### Search

- **List meetups by date.**

| ENDPOINT | Method | Params | URL Params | Success Response | Error Response
|--|--|--|--|--|--|

- **List meetups created by the signed-in user.**

| ENDPOINT | Method | Params | URL Params | Success Response | Error Response
|--|--|--|--|--|--|

### Notification

- **List the signed-in user notifications.**

| ENDPOINT | Method | Params | URL Params | Success Response | Error Response
|--|--|--|--|--|--|

- **Edit a notification to mark as read.**

| ENDPOINT | Method | Params | URL Params | Success Response | Error Response
|--|--|--|--|--|--|

### Meetups

- **List all meetups.**

| ENDPOINT | Method | Params | URL Params | Success Response | Error Response
|--|--|--|--|--|--|

- **Create new meetup.**

| ENDPOINT | Method | Params | URL Params | Success Response | Error Response
|--|--|--|--|--|--|

- **Edit an existing meetup.**

| ENDPOINT | Method | Params | URL Params | Success Response | Error Response
|--|--|--|--|--|--|

- **Delete a meetup.**

| ENDPOINT | Method | Params | URL Params | Success Response | Error Response
|--|--|--|--|--|--|

### File

- **Upload new file.**

| ENDPOINT | Method | Params | URL Params | Success Response | Error Response
|--|--|--|--|--|--|

### Enrollment

- **Create a new enrollment.**

| ENDPOINT | Method | Params | URL Params | Success Response | Error Response
|--|--|--|--|--|--|


### Models

#### User

> *name*: User's name.

> *email*: User's email.

> *password_hash*: User's password hash.

> *provider*:  Boolean to identify the user as a meetup organizer.

> *avatar_id*:  ID of the file that represents the user's avatar.

```json
{
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password_hash: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    provider: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    avatar_id: {
      type: Sequelize.INTEGER,
      references: { model: 'files', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    }
}
```

#### Meetups

> "title": Title of the meetup.

> "description": Description of the meetup.

> *localization*: Location of the meetup.

> *date*: Date of the meetup.

> *user_id*: ID of the user that created this meetup.

> *banner_id*: ID of the file that represents the meetup's banner.

```json
{
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    localization: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    user_id: {
      type: Sequelize.INTEGER,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    },
    banner_id: {
      type: Sequelize.INTEGER,
      references: { model: 'files', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: false,
    }
}
```

#### Enrollments

> "meetup_id": ID of the meetup the user is registering to.

> "user_id": User's ID.

```json
{
  meetup_id: {
      type: Sequelize.INTEGER,
      references: { model: 'meetups', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      allowNull: false,
    },
    user_id: {
      type: Sequelize.INTEGER,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      allowNull: false,
    }
}
```

#### File

> "name": File's name.

> "path": File's path.

```json
{
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    path: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    }
}
```

## Built With

- [NodeJS](https://nodejs.org/en/) - Build the server
- [Express](https://expressjs.com/) - Router of the Application
- [PostgreSQL](https://www.postgresql.org/) - Database
- [MongoDB](https://www.mongodb.com/) - Database
- [Redis](https://redis.io/) - Database
- [Mongoose](https://mongoosejs.com/) - Object Modeling + DB Connector
- [Nodemon](https://nodemon.io/) - Process Manager used in the development
- [Dotenv](https://github.com/motdotla/dotenv) - Environment loader
- [Multer](https://github.com/expressjs/multer) - File Upload
- [Eslint](https://eslint.org/) - JS Linter and code style
- [Prettier](https://github.com/prettier/prettier) - Code formatter
- [Sentry](https://sentry.io/) - Error monitor
- [Bcryptjs](https://www.npmjs.com/package/bcryptjs) - Password hashing function
- [Bee-queue](https://github.com/bee-queue/bee-queue) - Job/task queue
- [Date-fns](https://date-fns.org/) - Format dates
- [Jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - JSON Web Token
- [Nodemailer](https://nodemailer.com/about/) - Email sender
- [Sequelize](https://github.com/prettier/prettier) - ORM for Postgres
- [Yup](https://github.com/jquense/yup) - Object schema validator
- [Youch](https://www.npmjs.com/package/youch) - Pretty error reporting
- [Sucrase](https://sucrase.io/) - Babel alternative

## Support tools

- [Amazon S3](https://aws.amazon.com/pt/s3/) - Storage Service

## Contributing

You can send how many PR's do you want, I'll be glad to analyze and accept them! And if you have any questions about the project...

Email-me: paulowsantos@gmail.com

Connect with me at [LinkedIn](https://www.linkedin.com/in/paulo-wayner/)

Thank you!

## License

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/paulowsantos/Meetapp/blob/master/LICENSE) file for details.
