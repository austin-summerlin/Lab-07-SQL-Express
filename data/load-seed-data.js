/* eslint-disable indent */
/* eslint-disable no-console */
import client from '../lib/client.js';
// import our seed data:
import movies from './movies.js';

run();

async function run() {

  try {

    await Promise.all(
      movies.map(movie => {
        return client.query(`
          INSERT INTO movies (name, sub_genre, year, director, country, length)
          VALUES ($1, $2, $3, $4, $5, $6);
        `,
          [movie.name, movie.subGenre, movie.year, movie.director, movie.country, movie.length]);
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