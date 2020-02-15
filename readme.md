# ![RealWorld Example App](project-logo.png)

###  Node.js, express.js and Sequelize codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld) spec and API.


### [Demo](https://techuppa-kom.herokuapp.com/)&nbsp;&nbsp;&nbsp;&nbsp;[RealWorld](https://github.com/gothinkster/realworld)


This codebase was created to demonstrate a fully fledged fullstack application built with node.js, express.js, [Sequelize](https://sequelize.org/), and Postgres including CRUD operations, authentication, routing, pagination, and more.

We've gone to great lengths to adhere to the express community styleguides & best practices.

For more information on how to this works with other frontends/backends, head over to the [RealWorld](https://github.com/gothinkster/realworld) repo.


# How it works

The public folder has a complied JavaScript client in it to
interact with the program.

# Getting started

To get the server running locally:

 - Install postgres
 - run `npm install`
 - create a .env file do define the environment variables like
   this:
```
JWT_SECRET=<secure random string>
DATABASE_URL=postgresql://postgres@localhost:5432/realworld
PORT=3010
```
 - then run `npm start`
