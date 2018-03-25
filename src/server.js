#!/usr/bin/env ./node_modules/.bin/babel-node

import 'babel-polyfill';

import express from 'express';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import bodyParser from 'body-parser';
import compression from 'compression';
import { makeExecutableSchema } from 'graphql-tools';
import expressPlayground from 'graphql-playground-middleware-express';
import RateLimit from 'express-rate-limit';

import {
  config,
  postiConfig,
} from 'posti';

import {
  typeDefs,
  resolvers,
} from './graphql';

global.config = config;
global.postiConfig = postiConfig;

const serverConfig = {
  port: 3000,
  tracing: true,
  cacheControl: true,
  production: false,
  limiter: {
    windowMs: 24 * 60 * 60 * 1000,
    delayAfter: 5,
    delayMs: 10 * 1000,
    max: 20,
  },
  ...global.config.server,
};

const app = express();

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

app.use(compression());

app.enable('trust proxy');

const limiter = new RateLimit(serverConfig.limiter);

app.use('/graphql', limiter, bodyParser.json(), graphqlExpress({
  schema,
  tracing: serverConfig.tracing,
  cacheControl: serverConfig.cacheControl,
}));
if (!serverConfig.production) {
  app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
  app.get('/playground', expressPlayground({ endpoint: '/graphql' }));
}

app.listen(serverConfig.port, () => {
  console.info(`GraphQL endpoint:         http://localhost:${serverConfig.port}/graphql`);
  if (!serverConfig.production) {
    console.info('----');
    console.info('For development:');
    console.info(`  GraphiQL served in:     http://localhost:${serverConfig.port}/graphiql`);
    console.info(`  Playground served in:   http://localhost:${serverConfig.port}/playground`);
  }
});
