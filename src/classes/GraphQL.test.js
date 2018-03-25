import fs from 'fs-extra';
import path from 'path';

import GraphQL from './GraphQL';

const graphql = new GraphQL();

describe('GraphQL', () => {
  beforeAll(() => {
    // Set timeout to 10 minutes
    jest.setTimeout(10 * 60 * 1000);
  });

  describe('isConnected()', () => {
    test('should not be connected', async () => {
      expect(await graphql.isConnected()).toBe(false);
    });
  });

  describe('connect()', () => {
    test('should connect', async () => {
      await graphql.connect();
      expect(await graphql.isConnected()).toBe(true);
    });
  });

  describe('isConnected()', () => {
    test('should be connected', async () => {
      await graphql.connect();
      expect(await graphql.isConnected()).toBe(true);
    });
  });

  describe('defineTable()', () => {
    test('should define table model', async () => {
      await graphql.defineTable('ADDRESSES');
      await graphql.defineTable('ZIPCODES');
      await graphql.defineTable('ZIPCODE_CHANGES');

      expect(typeof graphql.getTableModel('ADDRESSES')).toBe('function');
      expect(typeof graphql.getTableModel('ZIPCODES')).toBe('function');
      expect(typeof graphql.getTableModel('ZIPCODE_CHANGES')).toBe('function');
    });
  });

  describe('createTableSchema()', () => {
    const typesDir = path.resolve(`${__dirname}/../graphql/Types`);
    fs.removeSync(typesDir);

    test('should not have Types dir', async () => {
      expect(fs.existsSync(typesDir)).toBe(false);
    });

    test('should create GraphQL schema', async () => {
      await graphql.createTableSchema('ADDRESSES');
      let tableConfig = graphql.getTableConfigs('ADDRESSES');
      let filePath = `${typesDir}/${tableConfig.graphqlQuery}.js`;
      let file = path.resolve(filePath);
      expect(fs.existsSync(file)).toBe(true);

      await graphql.createTableSchema('ZIPCODES');
      tableConfig = graphql.getTableConfigs('ZIPCODES');
      filePath = `${typesDir}/${tableConfig.graphqlQuery}.js`;
      file = path.resolve(filePath);
      expect(fs.existsSync(file)).toBe(true);

      await graphql.createTableSchema('ZIPCODE_CHANGES');
      tableConfig = graphql.getTableConfigs('ZIPCODE_CHANGES');
      filePath = `${typesDir}/${tableConfig.graphqlQuery}.js`;
      file = path.resolve(filePath);
      expect(fs.existsSync(file)).toBe(true);
    });

    test('should create Types dir', async () => {
      expect(fs.existsSync(typesDir)).toBe(true);
    });
  });

  describe('castGraphQLType()', () => {
    test('should cast integer', async () => {
      expect(graphql.castGraphQLType('integer')).toBe('Int');
    });
    test('should cast YYYYMMDD', async () => {
      expect(graphql.castGraphQLType('YYYYMMDD')).toBe('Date');
    });
    test('should not cast string', async () => {
      expect(graphql.castGraphQLType('other')).toBe('String');
    });
  });
});
