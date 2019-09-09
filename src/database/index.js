import Sequelize from 'sequelize';
import mongoose from 'mongoose';

import User from '../app/models/User';
import File from '../app/models/File';
import Meetups from '../app/models/Meetups';
import Enrollments from '../app/models/Enrollments';
import databaseConfig from '../config/database';

const models = [User, File, Meetups, Enrollments];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }

  mongo() {
    this.mongoConnection = mongoose.connect(
      'mongodb://localhost:27017/meetapp',
      { useNewUrlParser: true, useFindAndModify: false }
    );
  }
}

export default new Database();
