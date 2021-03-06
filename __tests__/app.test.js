import app from '../lib/app.js';
import supertest from 'supertest';
import client from '../lib/client.js';
import { execSync } from 'child_process';

const request = supertest(app);

describe('API Routes', () => {

  afterAll(async () => {
    return client.end();
  });

  describe('/api/movies', () => {

    let user;

    beforeAll(async () => {
      execSync('npm run recreate-tables');

      const response = await request
        .post('/api/auth/signup')
        .send({
          name: 'Jason Vorhees',
          email: 'hockeylover@campcrystallake.com',
          password: 'machete'
        });

      expect(response.status).toBe(200);

      user = response.body;
    });

    let dawn = {
      id: expect.any(Number),
      name: 'Dawn of the Dead',
      genre: 'Zombie',
      year: 1978,
      director: 'George A. Romero',
      country: 'US',
      length: '2 Hours 7 Minutes',
      url: '/movies/dawn.png'
    };

    let suspiria = {
      id: expect.any(Number),
      name: 'Suspiria',
      genre: 'Giallo',
      year: 1977,
      director: 'Dario Argento',
      country: 'Italy',
      length: '1 Hours 32 Minutes',
      url: '/movies/suspiria.png'
    };

    let friday = {
      id: expect.any(Number),
      name: 'Friday The 13th',
      genre: 'Slasher',
      year: 1980,
      director: 'Sean S. Cunningham',
      country: 'US',
      length: '1 Hours 35 Minutes',
      url: '/movies/friday.png'
    };

    test('POST dawn to /api/movies', async () => {
      dawn.userId = user.id;
      const response = await request
        .post('/api/movies')
        .send(dawn);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(dawn);

      dawn = response.body;
    });

    test('PUT updated dawn to /api/movies/:id', async () => {
      dawn.year = 1984;
      dawn.name = 'Day of the Dead';

      const response = await request
        .put(`/api/movies/${dawn.id}`)
        .send(dawn);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(dawn);
    });

    test('GET list of movies from /api/movies', async () => {
      suspiria.userId = user.id;
      const r1 = await request.post('/api/movies').send(suspiria);
      suspiria = r1.body;
      friday.userId = user.id;
      const r2 = await request.post('/api/movies').send(friday);
      friday = r2.body;

      const response = await request.get('/api/movies');

      expect(response.status).toBe(200);

      const expected = [dawn, suspiria, friday].map(movie => {
        return {
          userName: user.name,
          ...movie
        };
      });

      expect(response.body).toEqual(expect.arrayContaining(expected));
    });

    test('GET suspiria from /api/movies/:id', async () => {
      const response = await request.get(`/api/movies/${suspiria.id}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ ...suspiria, userName: user.name });
    });

    test('DELETE suspiria from /api/movies/:id', async () => {
      const response = await request.delete(`/api/movies/${suspiria.id}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(suspiria);

      const getResponse = await request.get('/api/movies');
      expect(getResponse.status).toBe(200);
      expect(getResponse.body.find(movie => movie.id === suspiria.id)).toBeUndefined();
    });

    describe('seed data tests', () => {

      beforeAll(() => {
        execSync('npm run setup-db');
      });

      test('GET /api/movies', async () => {
        // act - make the request
        const response = await request.get('/api/movies');

        // was response OK (200)?
        expect(response.status).toBe(200);

        // did it return some data?
        expect(response.body.length).toBeGreaterThan(0);

        // did the data get inserted?
        expect(response.body[0]).toEqual({
          id: expect.any(Number),
          name: expect.any(String),
          genre: expect.any(String),
          year: expect.any(Number),
          director: expect.any(String),
          country: expect.any(String),
          length: expect.any(String),
          url: expect.any(String),
          userId: expect.any(Number),
          userName: expect.any(String)
        });
      });
    });
  });
});