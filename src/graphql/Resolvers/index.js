import graphqlFields from 'graphql-fields';
import { Op } from 'sequelize';

import GrahpQL from '../../classes/GraphQL';

import DateResolver from './Date';

import BuildingNumberResolver from './BuildingNumber';

/**
 * Get options.
 *
 * @param {Object} args - Arguments.
 * @param {Object} info - Info.
 *
 * @returns {Object} Options for query.
 */
const options = (args, info) => {
  const where = {};
  const criteria = args.where;
  if (criteria) {
    Object.keys(criteria).forEach((field) => {
      if (field === 'buildingNumber') {
        where[Op.or] = [
          {
            [Op.or]: [
              { smallestBuildingNumber1: { [Op.eq]: criteria[field] } },
              { smallestBuildingNumber2: { [Op.eq]: criteria[field] } },
              { highestBuildingNumber1: { [Op.eq]: criteria[field] } },
              { highestBuildingNumber2: { [Op.eq]: criteria[field] } },
            ],
          },
          {
            [Op.and]: [
              {
                [Op.or]: [
                  { smallestBuildingNumber1: { [Op.or]: [{ [Op.lte]: criteria[field] }] } },
                  { smallestBuildingNumber2: { [Op.or]: [{ [Op.lte]: criteria[field] }] } },
                ],
              },
              {
                [Op.or]: [
                  { highestBuildingNumber1: { [Op.or]: [{ [Op.gte]: criteria[field] }] } },
                  { highestBuildingNumber2: { [Op.or]: [{ [Op.gte]: criteria[field] }] } },
                ],
              },
            ],
          },
        ];
        where.oddEven = { [Op.eq]: (criteria[field] % 2 ? 1 : 2) };
      } else {
        where[field] = { [Op.like]: criteria[field] };
      }
    });
  }

  let limit = global.config.server.query.defaultLimit;

  if (args.limit) {
    limit = args.limit >= global.config.server.query.maxLimit
      ? global.config.server.query.maxLimit
      : args.limit;
  }

  return {
    attributes: Object.keys(graphqlFields(info)),
    where,
    limit,
  };
};

const database = new GrahpQL();
let models = {};
database.connect()
  .then(async () => {
    Promise
      .all([
        await database.defineTable('ADDRESSES'),
        await database.defineTable('ZIPCODES'),
        await database.defineTable('ZIPCODE_CHANGES'),
      ])
      .then(() => {
        models = {
          addresses: database.getTableModel('ADDRESSES'),
          postalCodes: database.getTableModel('ZIPCODES'),
          postalCodeChanges: database.getTableModel('ZIPCODE_CHANGES'),
        };
      });
  });


export default {
  ...DateResolver,
  ...BuildingNumberResolver,

  Query: {
    Addresses: (obj, args, context, info) => (
      models.addresses.findAll(options(args, info))
    ),
    PostalCodes: (obj, args, context, info) => (
      models.postalCodes.findAll(options(args, info))
    ),
    PostalCodeChanges: (obj, args, context, info) => (
      models.postalCodeChanges.findAll(options(args, info))
    ),
  },
};
