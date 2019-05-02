import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import moment from 'moment';

export default {
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
      moment(value).format('YYYY-MM-DD')
    ),

    /**
     * serialize.
     *
     * @param {String} value - Value.
     *
     * @returns {Date} Timestamp in milliseconds.
     */
    serialize: value => (
      moment(value).format('YYYY-MM-DD')
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
        return moment(parseInt(ast.value, 10)).format('YYYY-MM-DD');
      } else if (ast.kind === Kind.STRING) {
        return moment(ast.value).format('YYYY-MM-DD');
      }
      return null;
    },
  }),
};
