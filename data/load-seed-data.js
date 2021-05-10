/* eslint-disable indent */
/* eslint-disable no-console */
import client from '../lib/client.js';
// import our seed data:
import users from './users.js';
import movies from './movies.js';

run();

async function run() {

  try {

    const data = await Promise.all(
      users.map(user => {
        return client.query(`
        INSERT INTO users (name, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING *;
        `,
          [user.name, user.email, user.password]);
      })
    );

    const user = data[0].rows[0];

    await Promise.all(
      movies.map(movie => {
        return client.query(`
          INSERT INTO movies (name, genre, year, director, country, length, url, user_id)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
        `,
          [movie.name, movie.genre, movie.year, movie.director, movie.country, movie.length, movie.url, user.id]);
      })
    );


    console.log('seed data load complete');
  }
  catch (err) {
    console.log(err);
  }
  finally {
    client.end();
  }

}