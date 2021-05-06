/* eslint-disable no-console */
import client from '../lib/client.js';

// async/await needs to run in a function
run();

async function run() {

  try {

    // run a query to create tables
    await client.query(`
    
      CREATE TABLE users (
        id SERIAL PRIMARY KEY NOT NULL,
        name VARCHAR(512) NOT NULL,
        email VARCHAR(512) NOT NULL,
        password_hash VARCHAR(512) NOT NULL
      );

      CREATE TABLE movies (
        id SERIAL PRIMARY KEY NOT NULL,
        name VARCHAR(512) NOT NULL,
        genre VARCHAR(512) NOT NULL,
        year INTEGER NOT NULL,
        director VARCHAR(1024) NOT NULL,
        country VARCHAR(512) NOT NULL,
        length VARCHAR(512) NOT NULL
        user_id INTERGER NOT NULL REFERENCES users(id)
      );
    `);

    console.log('create tables complete');
  }
  catch (err) {
    // problem? let's see the error...
    console.log(err);
  }
  finally {
    // success or failure, need to close the db connection
    client.end();
  }

}