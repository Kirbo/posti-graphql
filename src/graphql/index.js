import { gql } from 'apollo-server-express';

import Scalars from './Scalars';
import Types from './Types';
import Query from './Query';

import resolvers from './Resolvers';

const typeDefs = gql`
${Scalars}
${Types}
${Query}

schema {
  query: Query
}
`;

export {
  typeDefs,
  resolvers,
};
