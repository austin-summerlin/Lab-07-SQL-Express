import app from '../lib/app.js';
import supertest from 'supertest';
import client from '../lib/client.js';
import { execSync } from 'child_process';

const request = supertest(app);

describe('API Routes', () => {

  beforeAll(() => {
    execSync('npm run setup-db');
  });

  afterAll(async () => {
    return client.end();
  });

  const expectedMovies = [
    {
      name: 'Dawn of the Dead',
      genre: 'Zombie',
      id: 1,
      year: 1978,
      director: 'George A. Romero',
      country: 'US',
      length: '2 Hours 7 Minutes',
    },
    {
      name: 'Suspiria',
      genre: 'Giallo',
      id: 2,
      year: 1977,
      director: 'Dario Argento',
      country: 'Italy',
      length: '1 Hour 32 Minutes',

    },
    {
      name: 'Friday The 13th',
      genre: 'Slasher',
      id: 3,
      year: 1980,
      director: 'Sean S. Cunningham',
      country: 'US',
      length: '1 Hour 35 Minutes',
    },
    {
      name: 'Nightmare On Elm Street ',
      genre: 'Slasher',
      id: 4,
      year: 1984,
      director: 'Wes Craven',
      country: 'US',
      length: '1 Hour 31 Minutes',
    },
    {
      name: 'A Girl Walks Home Alone At Night',
      genre: 'Vampire',
      id: 5,
      year: 2014,
      director: 'Ana Lily Amirpour',
      country: 'Iran',
      length: '1 Hour 41 Minutes',
    },
    {
      name: 'Let The Right One In',
      genre: 'Vampire',
      id: 6,
      year: 2008,
      director: 'Tomas Alfredson',
      country: 'Sweeden',
      length: '1 Hour 54 Minutes',
    },
    {
      name: 'The Babadook',
      genre: 'Supernatural',
      id: 7,
      year: 2014,
      director: 'Jennifer Kent',
      country: 'Australia',
      length: '1 Hour 34 Minutes',
    },
    {
      name: 'Cannibal Holocaust',
      genre: 'Giallo',
      id: 8,
      year: 1980,
      director: 'Ruggero Deodato',
      country: 'Italy',
      length: '1 Hour 35 Minutes',
    }
  ];

  // If a GET request is made to /api/cats, does:
  // 1) the server respond with status of 200
  // 2) the body match the expected API data?
  it('GET /api/movies', async () => {
    // act - make the request
    const response = await request.get('/api/movies');

    // was response OK (200)?
    expect(response.status).toBe(200);

    // did it return the data we expected?
    expect(response.body).toEqual(expectedMovies);

  });

  // If a GET request is made to /api/cats/:id, does:
  // 1) the server respond with status of 200
  // 2) the body match the expected API data for the cat with that id?
  test('GET /api/movies/:id', async () => {
    const response = await request.get('/api/movies/2');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedMovies[1]);
  });
});