import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';

export default {
  BuildingNumber: new GraphQLScalarType({
    name: 'BuildingNumber',
    description: 'Search for building number.\n'
      + 'Automacitally searches with the range between:\n'
      + '  - smallestBuildingNumber1\n'
      + '  - smallestBuildingNumber2\n'
      + '  - highestBuildingNumber1\n'
      + '  - highestBuildingNumber2\n',

    /**
     * Parse value.
     *
     * @param {String} value - Value.
     *
     * @returns {Date} New date.
     */
    parseValue: value => (
      parseInt(value, 10)
    ),

    /**
     * serialize.
     *
     * @param {String} value - Value.
     *
     * @returns {Date} Timestamp in milliseconds.
     */
    serialize: value => (
      parseInt(value, 10)
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
};
