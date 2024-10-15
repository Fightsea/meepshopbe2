import { createAccount, getBalance, deposit, withdraw, transfer, getTransactionLogs } from '../src/services/accounts.js';

describe('Account Service Tests', () => {
  let account1, account2;

  beforeEach(() => {});

  test('should create accounts correctly', async () => {
    account1 = await createAccount('Nicky', 500);
    expect(account1.name).toBe('Nicky');
    expect(account1.balance).toBe(500);
  });

  test('should get balance correctly', () => {
    const res1 = getBalance(account1.id);
    expect(res1.name).toBe('Nicky');
    expect(res1.balance).toBe(500);
  });

  test('should deposit correctly', async () => {
    const res1 = await deposit(account1.id, 200);
    expect(res1.name).toBe('Nicky');
    expect(res1.balance).toBe(700);
  });

  test('should withdraw correctly', async () => {
    const res1 = await withdraw(account1.id, 300);
    expect(res1.name).toBe('Nicky');
    expect(res1.balance).toBe(400);
  });

  test('should transfer money between accounts', async () => {
    account2 = await createAccount('Grace', 600);
    expect(account2.name).toBe('Grace');
    expect(account2.balance).toBe(600);

    const res = await transfer(account1.id, account2.id, 300);
    expect(res.from).toBe(account1.id);
    expect(res.to).toBe(account2.id);
    expect(res.amount).toBe(300);

    const res1 = getBalance(account1.id);
    expect(res1.name).toBe('Nicky');
    expect(res1.balance).toBe(100);

    const res2 = getBalance(account2.id);
    expect(res2.name).toBe('Grace');
    expect(res2.balance).toBe(900);
  });

  test('should get transaction logs', () => {
    const res = getTransactionLogs(0);
    expect(res).toBeDefined();
    expect(res).not.toBeNull();
  });
});
