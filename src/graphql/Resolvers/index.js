import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import graphqlFields from 'graphql-fields';

import { config } from 'posti';
import GrahpQL from '../../classes/GraphQL';

global.config = config;

const database = new GrahpQL();
let models = {};
database.connect()
  .then(async () => {
    await database.defineTable('ADDRESSES');
    await database.defineTable('ZIPCODES');
    await database.defineTable('ZIPCODE_CHANGES');
    models = {
      addresses: database.getTableModel('ADDRESSES'),
      postalCodes: database.getTableModel('ZIPCODES'),
      postalCodeChanges: database.getTableModel('ZIPCODE_CHANGES'),
    };
  });

const resolverMap = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date either in ISO-8601 format or in epoch.',

    /**
     * Parse value.
     *
     * @param {String} value - Value.
     *
     * @returns {Date} New date.
     */
    parseValue: value => (
      new Date(value)
    ),

    /**
     * serialize.
     *
     * @param {String} value - Value.
     *
     * @returns {Date} Timestamp in milliseconds.
     */
    serialize: value => (
      value.getTime()
    ),

    /**
     * Parse literal.
     *
     * @param {String} ast - Value.
     *
     * @returns {Date} New date.
     */
    parseLiteral: (ast) => {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10);
      }
      return null;
    },
  }),

  Query: {
    Addresses: (obj, { where }, context, info) => {
      const options = {
        where,
        attributes: {
          include: Object.keys(graphqlFields(info)),
        },
        limit: 100,
      };

      return models.addresses.findAll(options);
    },
    PostalCodes: (obj, { where }, context, info) => {
      const options = {
        where,
        attributes: {
          include: Object.keys(graphqlFields(info)),
        },
        limit: 100,
      };

      return models.postalCodes.findAll(options);
    },
    PostalCodeChanges: (obj, { where }, context, info) => {
      const options = {
        where,
        attributes: {
          include: Object.keys(graphqlFields(info)),
        },
        limit: 100,
      };

      return models.postalCodeChanges.findAll(options);
    },
  },
};

export default resolverMap;
