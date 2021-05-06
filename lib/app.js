/* eslint-disable indent */
/* eslint-disable no-console */
// import dependencies
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import client from './client.js';

// make an express app
const app = express();

// allow our server to be called from any website
app.use(cors());
// read JSON from body of request when indicated by Content-Type
app.use(express.json());
// enhanced logging
app.use(morgan('dev'));

// heartbeat route
app.get('/', (req, res) => {
  res.send('Horror Movie API');
});

// API routes,

app.post('/api/movies', async (req, res) => {
  try {
    const movie = req.body;

    const data = await client.query(`
      INSERT INTO movies (name, genre, year, director, country, length)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, name, genre, year, director, country, length;
      `, [movie.name, movie.genre, movie.year, movie.director, movie.country, movie.length]);

    res.json(data.rows[0]);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/movies/:id', async (req, res) => {
  try {
    const movie = req.body;

    const data = await client.query(`
      UPDATE movies
        SET name = $1, genre = $2, year = $3,
            director = $4, country = $5, length = $6
        WHERE id = $7
        RETURNING id, name, genre, year, director, country, length;
        `, [movie.name, movie.genre, movie.year, movie.director, movie.country, movie.length, req.params.id]);

    res.json(data.rows[0]);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/movies/:id', async (req, res) => {
  try {
    const data = await client.query(`
      DELETE FROM movies
      WHERE id = $1
      RETURNING id, name, genre, year, director, country, length;
    `,
      [req.params.id]);

    res.json(data.rows[0]);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/movies', async (req, res) => {
  // use SQL query to get data...
  try {
    const data = await client.query(`
      SELECT  id,
              name,
              genre,
              year,
              director,
              country,
              length
      FROM    movies;
    `);

    // send back the data
    res.json(data.rows);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/movies/:id', async (req, res) => {
  // use SQL query to get data...
  try {
    const data = await client.query(`
      SELECT  id,
              name,
              genre,
              year,
              director,
              country,
              length
      FROM    movies
      WHERE   id = $1;
    `, [req.params.id]);

    // send back the data
    res.json(data.rows[0] || null);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

// If a GET request is made to /api/cats, does:
// 1) the server respond with status of 200
// 2) the body match the expected API data?
test.skip('GET /api/movies', async () => {
  // act - make the request
  // eslint-disable-next-line no-undef
  const response = await request.get('/api/movies');

  // was response OK (200)?
  expect(response.status).toBe(200);

  // did it return the data we expected?
  // eslint-disable-next-line no-undef
  expect(response.body).toEqual(expectedMovies);

});

// If a GET request is made to /api/cats/:id, does:
// 1) the server respond with status of 200
// 2) the body match the expected API data for the cat with that id?
test.skip('GET /api/movies/:id', async () => {
  // eslint-disable-next-line no-undef
  const response = await request.get('/api/movies/2');
  expect(response.status).toBe(200);
  // eslint-disable-next-line no-undef
  expect(response.body).toEqual(expectedMovies[1]);
});

export default app;