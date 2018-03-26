import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import graphqlFields from 'graphql-fields';
import Sequelize from 'sequelize';

import { config } from 'posti';
import GrahpQL from '../../classes/GraphQL';

const { Op } = Sequelize;

global.config = config;

/**
 * Get options.
 *
 * @param {Object} criteria - Where criteria.
 * @param {Object} info - Info.
 *
 * @returns {Object} Options for query.
 */
const options = (criteria, info) => {
  const where = {};
  Object.keys(criteria).forEach((field) => {
    where[field] = { [Op.like]: criteria[field] };
  });
  return {
    where,
    attributes: {
      include: Object.keys(graphqlFields(info)),
    },
    limit: 100,
  };
};

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
    Addresses: (obj, { where }, context, info) => (
      models.addresses.findAll(options(where, info))
    ),
    PostalCodes: (obj, { where }, context, info) => (
      models.postalCodes.findAll(options(where, info))
    ),
    PostalCodeChanges: (obj, { where }, context, info) => (
      models.postalCodeChanges.findAll(options(where, info))
    ),
  },
};

export default resolverMap;
