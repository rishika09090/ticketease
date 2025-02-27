const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

describe('Ticket Routes', () => {
  beforeAll(() => {
    mongoose.connect("mongodb://localhost:27017/ticketease");
  });

  afterAll(() => {
    mongoose.connection.close();
  });

  it('should create a new ticket', async () => {
    const res = await request(app)
      .post('/api/tickets')
      .send({
        dateOfTravel: '2025-03-01',
        modeOfTravel: 'bus',
        perHeadPrice: 500,
        from: 'Chandigarh',
        to: 'Delhi',
        numberOfPassengers: 2
      })
      .set('Authorization', 'Bearer valid_jwt_token')
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(201);
  });
});
