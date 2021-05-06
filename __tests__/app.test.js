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

    beforeAll(() => {
      execSync('npm run recreate-tables');
    });


    let dawn = {
      id: expect.any(Number),
      name: 'Dawn of the Dead',
      genre: 'Zombie',
      year: 1978,
      director: 'George A. Romero',
      country: 'US',
      length: '2 Hours 7 Minutes'
    };

    let suspiria = {
      id: expect.any(Number),
      name: 'Suspiria',
      genre: 'Giallo',
      year: 1977,
      director: 'Dario Argento',
      country: 'Italy',
      length: '1 Hours 32 Minutes'
    };

    let friday = {
      id: expect.any(Number),
      name: 'Friday The 13th',
      genre: 'Slasher',
      year: 1980,
      director: 'Sean S. Cunningham',
      country: 'US',
      length: '1 Hours 35 Minutes'
    };

    test('POST dawn to /api/movies', async () => {
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
      const r1 = await request.post('/api/movies').send(suspiria);
      suspiria = r1.body;
      const r2 = await request.post('/api/movies').send(friday);
      friday = r2.body;

      const response = await request.get('/api/movies');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.arrayContaining([dawn, suspiria, friday]));
    });

    test('GET suspiria from /api/movies/:id', async () => {
      const response = await request.get(`/api/movies/${suspiria.id}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(suspiria);
    });

    test('DELETE suspiria from /api/movies', async () => {
      const response = await request.delete(`/api/movies/${suspiria.id}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(suspiria);

      const getResponse = await request.get('/api/movies');
      expect(getResponse.status).toBe(200);
      expect(getResponse.body).toEqual(expect.arrayContaining([dawn, friday]));
    });
  });
});