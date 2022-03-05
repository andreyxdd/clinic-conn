// @ts-nocheck
require('dotenv').config();

const conn = {
  type: 'postgres',
  host: 'ec2-54-235-98-1.compute-1.amazonaws.com',
  port: 5432,
  username: 'jrypwppneyonfm',
  password: '1b3bbca0a3d86558581dcf7221ab471ed3155fb4a143542bbae5c3015112862c',
  database: 'dau2opfilkovbf',
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
  synchronize: true,
  logging: false,
  entities: process.env.NODE_ENV === 'production' ? ['dist/src/entities/**/*.js'] : ['src/entities/**/*.ts'],
  migrations: process.env.NODE_ENV === 'production' ? ['dist/src/migrations/**/*.js'] : ['src/migrations/**/*.ts'],
  subscribers: process.env.NODE_ENV === 'production' ? ['dist/src/subscribers/**/*.js'] : ['src/subscribers/**/*.ts'],
  cli: {
    entitiesDir: process.env.NODE_ENV === 'production' ? 'dist/src/entities' : 'src/entities',
    migrationsDir: process.env.NODE_ENV === 'production' ? 'dist/src/migrations' : 'src/migrations',
    subscribersDir: process.env.NODE_ENV === 'production' ? 'dist/src/migrations' : 'src/migrations',
  },
};

module.exports = conn;
