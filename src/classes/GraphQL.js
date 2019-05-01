import fs from 'fs-extra';
import path from 'path';
import Sequelize from 'sequelize';

import { config } from 'posti';

import {
  logStep,
} from 'posti/dist/utils';

import Database from 'posti/dist/classes/Sequelize';

global.config = config;

/**
 * GraphQL
 *
 * @class
 */
class GraphQL extends Database {
  /**
   * Connect database
   *
   * @returns {Sequelize} Connected Sequelize.
   */
  connect = async () => {
    if (!await this.isConnected()) {
      this.database = new Sequelize(
        global.config.database,
        global.config.user,
        global.config.password,
        {
          logging: false,
          host: global.config.host,
          dialect: global.config.dialect,
          ...global.config.dialectOptions,
        }
      );

      return this.database.authenticate();
    } else {
      return true;
    }
  }

  /**
   * Define table model for Sequelize.
   *
   * @param {String} tableKey - Table key.
   *
   * @returns {void}
   */
  defineTable = async (tableKey) => {
    this.models[tableKey] = this.database.define(
      this.getTableName(tableKey).nameFinished,
      this.getTableDefinitions(tableKey),
      this.getTableDatabaseOptions(tableKey)
    );
  }

  /**
   * Create GraphQL schema.
   *
   * @param {String} tableKey - Table key.
   *
   * @returns {void}
   */
  createTableSchema = async (tableKey) => {
    const tableConfig = this.getTableConfigs(tableKey);
    const dir = path.resolve(`${__dirname}/../graphql/Types`);
    if (!fs.existsSync(dir)) {
      logStep(`Creating folder for types: ${dir}`);
      fs.ensureDirSync(dir);
    }
    const typeFile = path.resolve(`${dir}/${tableConfig.graphqlQuery}.js`);

    logStep(tableKey);

    const filePrefix = '/* This file is auto-generated, any changes will be overwritten ! */\n\n';

    let contents = '';

    Object.keys(tableConfig.fields).forEach((field) => {
      if (tableConfig.fields[field].extraComment) {
        contents += `\n  ### ${field} comments:\n`;
        contents += `  # - ${tableConfig.fields[field].extraComment.replace(/\n/g, '\n  # - ')}\n`;
        contents += '  ###';
      }
      contents += `\n  ${field}: ${this.castGraphQLType(tableConfig.fields[field].type)}`;
    });

    let definitions = 'const typeDefinitions = `\n';
    definitions += `type ${tableConfig.graphqlQuery} {`;
    definitions += `  ${contents}\n`;
    definitions += '}\n\n';

    definitions += `input ${tableConfig.graphqlQuery}Input {`;
    definitions += `  ${contents}\n`;
    definitions += '}`;\n\n';

    const fileSuffix = 'export default typeDefinitions;\n';

    fs.writeFileSync(typeFile, `${filePrefix}${definitions}${fileSuffix}`, 'utf8');
  };


  /**
   * Cast GraphQL type.
   *
   * @param {String} type - Original type.
   *
   * @returns {String} GraphQL type.
   */
  castGraphQLType = (type) => {
    switch (type) {
      case 'integer': {
        return 'Int';
      }
      case 'YYYYMMDD': {
        return 'Date';
      }
      default: {
        return 'String';
      }
    }
  };
}

export default GraphQL;
