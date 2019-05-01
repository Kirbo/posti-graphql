#!/usr/bin/env ./node_modules/.bin/babel-node

import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import compression from 'compression';
import RateLimit from 'express-rate-limit';
import SlowDown from 'express-slow-down';
import cors from 'cors';

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
  rateLimiter: {
    windowMs: 24 * 60 * 60 * 1000,
    max: 20,
  },
  speedLimiter: {
    delayAfter: 5,
    delayMs: 10 * 1000,
  },
  playground: {
    endpoint: '/graphql',
    settings: {
      'editor.theme': 'light',
    },
  },
  ...global.config.server,
};

const rateLimiter = RateLimit(serverConfig.rateLimiter);
const speedLimiter = SlowDown(serverConfig.speedLimiter);

const app = express();
app.use(compression());
app.enable('trust proxy');
app.use(rateLimiter);
app.use(speedLimiter);
if (serverConfig.cors) {
  app.use(cors(serverConfig.cors));
}

let playground = {};

if (!serverConfig.production) {
  // eslint-disable-next-line prefer-destructuring
  playground = serverConfig.playground;
}

const { tracing, cacheControl } = serverConfig;

new ApolloServer({ typeDefs, resolvers, tracing, cacheControl, playground }).applyMiddleware({ app });

app.listen(serverConfig.port, () => {
  console.info(`GraphQL endpoint:         http://localhost:${serverConfig.port}/graphql`);
  if (!serverConfig.production) {
    console.info('----');
    console.info('For development:');
    console.info(`  Playground served in:   http://localhost:${serverConfig.port}/graphql`);
  }
});
