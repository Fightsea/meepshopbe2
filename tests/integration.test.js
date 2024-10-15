import request from 'supertest';
import app from '../index.js';

describe('Banking API Integration Tests', () => {
  let account1, account2;

  it('should create accounts correctly', async () => {
    const res1 = await request(app).post('/api/accounts/create').send({ name: 'Nicky', balance: 500 });
    account1 = res1.body;
    expect(res1.statusCode).toEqual(201);
    expect(account1.name).toEqual('Nicky');
    expect(account1.balance).toEqual(500);
  });

  it('should get balance correctly', async () => {
    const res1 = await request(app).get(`/api/accounts/${account1.id}/balance`);
    expect(res1.statusCode).toEqual(200);
    expect(res1.body.name).toEqual('Nicky');
    expect(res1.body.balance).toEqual(500);
  });

  it('should deposit correctly', async () => {
    const res1 = await request(app).post(`/api/accounts/${account1.id}/deposit`).send({ amount: 200 });
    expect(res1.statusCode).toEqual(200);
    expect(res1.body.name).toEqual('Nicky');
    expect(res1.body.balance).toEqual(700);
  });

  it('should withdraw correctly', async () => {
    const res1 = await request(app).post(`/api/accounts/${account1.id}/withdraw`).send({ amount: 300 });
    expect(res1.statusCode).toEqual(200);
    expect(res1.body.name).toEqual('Nicky');
    expect(res1.body.balance).toEqual(400);
  });

  it('should transfer money between accounts', async () => {
    const resGrace = await request(app).post('/api/accounts/create').send({ name: 'Grace', balance: 600 });
    account2 = resGrace.body;
    expect(resGrace.statusCode).toEqual(201);
    expect(account2.name).toEqual('Grace');
    expect(account2.balance).toEqual(600);

    const res = await request(app).post('/api/accounts/transfer').send({ fromId: account1.id, toId: account2.id, amount: 300 });
    expect(res.statusCode).toEqual(200);
    expect(res.body.from).toBe(account1.id);
    expect(res.body.to).toBe(account2.id);
    expect(res.body.amount).toBe(300);

    const res1 = await request(app).get(`/api/accounts/${account1.id}/balance`);
    expect(res1.statusCode).toEqual(200);
    expect(res1.body.name).toEqual('Nicky');
    expect(res1.body.balance).toEqual(100);

    const res2 = await request(app).get(`/api/accounts/${account2.id}/balance`);
    expect(res2.statusCode).toEqual(200);
    expect(res2.body.name).toEqual('Grace');
    expect(res2.body.balance).toEqual(900);
  });

  it('should get transaction logs', async () => {
    const res = await request(app).get('/api/accounts/logs');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeDefined();
    expect(res.body).not.toBeNull();
  });
});
