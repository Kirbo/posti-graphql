#!/usr/bin/env ./node_modules/.bin/babel-node

import 'babel-polyfill';

import {
  logBlock,
  logError,
  logFinished,
  findDatabaseConfig,
  millisecondsToTime,
} from 'posti/dist/utils';

import GraphQL from './classes/GraphQL';

const started = new Date();

const configPath = findDatabaseConfig();
global.config = require(configPath).default;

(async () => {
  try {
    logBlock('Creating GraphQL schemas:');

    const graphql = new GraphQL();
    [
      'ADDRESSES',
      'ZIPCODES',
      'ZIPCODE_CHANGES',
    ].forEach(async (model) => {
      await graphql.createTableSchema(model, __dirname);
    });

    logFinished(millisecondsToTime(new Date() - started));
    process.exit(0);
  } catch (error) {
    logError(error);
  }
})();
