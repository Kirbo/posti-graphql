import fs from 'fs-extra';
import path from 'path';
import Sequelize from 'sequelize';

import { config } from 'posti';
import { logStep } from 'posti/dist/utils';
import Database from 'posti/dist/classes/Sequelize';

global.config = config;

/**
 * Enable logging.
 * @param {Object} proc - Process.
 * @returns {Boolean} - Whether logging is enabled or not.
 */
const enableLogging = (proc = process) => (
  proc.env.log
    // eslint-disable-next-line no-console
    ? console[(!['true', true].includes(proc.env.log) ? proc.env.log : 'log')]
    : false
);

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
          logging: enableLogging(),
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
        contents += `\n  """\n ## ${field} comments:\n`;
        contents += `    - ${tableConfig.fields[field].extraComment.replace(/\n/g, '\n    - ')}\n`;
        contents += '  """';
      }
      contents += `\n  ${field}: ${this.castGraphQLType(tableConfig.fields[field].type)}`;
    });

    let extendContents = '';
    const extensionFile = path.resolve(`${__dirname}/../graphql/Extend/${tableConfig.graphqlQuery}.js`);
    if (fs.existsSync(extensionFile)) {
      // eslint-disable-next-line global-require
      extendContents = require(extensionFile).default;
    }

    let definitions = 'const typeDefinitions = `\n';
    definitions += `type ${tableConfig.graphqlQuery} {`;
    definitions += `  ${contents}\n`;
    definitions += `${extendContents}`;
    definitions += '}\n\n';

    definitions += `input ${tableConfig.graphqlQuery}Input {`;
    definitions += `  ${contents}\n`;
    definitions += `${extendContents}`;
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
      case 'buildingNumber': {
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
export {
  enableLogging,
};
