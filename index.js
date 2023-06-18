"use strict";
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRouter = require("./router/authRouter");
var cookieParser = require("cookie-parser");
const port = 8080;
const app = express();
const SERVER_PREFIX = "/server";
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./graphql/typeDefs")
const resolvers = require("./graphql/resolvers")

async function startServer() {
  const graphQLServer = new ApolloServer({
    typeDefs,
    resolvers,
    // introspection: true,
    playground: true,
  });

  await graphQLServer.start();

  graphQLServer.applyMiddleware({ app: app });

  app.use(cors());
  app.use(cookieParser());
  app.use(bodyParser.json());

  app.use(`${SERVER_PREFIX}/auth`, authRouter.routes);

  app.listen(port, () => {
    console.log(`server is listening on url http://localhost:${port}`);
  });
}

startServer();
