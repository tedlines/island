import * as mongoose from 'mongoose';
import AbstractAdapter from '../abstract-adapter';
import { FatalError, ISLAND } from '../../utils/error';

export interface MongooseAdapterOptions {
  uri: string;
  connectionOptions?: mongoose.ConnectionOptions;
}

/**
 * MongooseAdapter
 * @class
 * @extends AbstractAdapter
 */
export default class MongooseAdapter extends AbstractAdapter<mongoose.Connection, MongooseAdapterOptions> {
  /**
   * Initialize the mongoose connection.
   * @returns {Promise<void>}
   * @override
   */
  public initialize() {
    return new Promise<void>((resolve, reject) => {
      if (!this.options) throw new FatalError(ISLAND.FATAL.F0025_MISSING_ADAPTER_OPTIONS);
      // Mongoose buffers all the commands until it's connected to the database.
      // But make sure to the case of using a external mongodb connector
      const connection = mongoose.createConnection(this.options.uri, this.options.connectionOptions);
      connection.once('open', () => {
        this._adaptee = connection;
        connection.removeAllListeners();
        resolve();
      });
      connection.once('error', (err) => {
        reject(err);
      });
    });
  }

  public destroy() {}
}
