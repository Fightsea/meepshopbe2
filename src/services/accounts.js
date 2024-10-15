import { Mutex } from 'async-mutex';

const mutex = new Mutex(); // To protect atomic operation
let accounts = {};
let transactionLogs = [];

/**
 * Create a new account with a starting balance
 * @param {string} name
 * @param {number} balance
 * @returns {string} accountId
 */
export const createAccount = async (name, balance) => {
  const release = await mutex.acquire();
  try {
    if (balance < 0) throw new Error('Initial balance cannot be negative');
    const id = Math.random().toString(36).substring(2, 9);
    accounts[id] = { id, name, balance };
    return { id, name, balance };
  } finally {
    release(); // unlock Mutex
  }
};

/**
 * Get the balance of an account by ID
 * @param {string} id
 * @returns {number} balance
 */
export const getBalance = id => {
  if (!accounts[id]) throw new Error('Account not found');
  return { id, name: accounts[id].name, balance: accounts[id].balance };
};

/**
 * Deposit money into an account
 * @param {string} id
 * @param {number} amount
 * @returns {number} newBalance
 */
export const deposit = async (id, amount) => {
  const release = await mutex.acquire();
  try {
    if (amount < 0) throw new Error('Deposit amount cannot be negative');
    accounts[id].balance += amount;
    return { id, name: accounts[id].name, balance: accounts[id].balance };
  } finally {
    release(); // unlock Mutex
  }
};

/**
 * Withdraw money from an account
 * @param {string} id
 * @param {number} amount
 * @returns {number} newBalance
 */
export const withdraw = async (id, amount) => {
  const release = await mutex.acquire();
  try {
    if (amount < 0 || accounts[id].balance < amount) throw new Error('Invalid withdrawal');
    accounts[id].balance -= amount;
    return { id, name: accounts[id].name, balance: accounts[id].balance };
  } finally {
    release(); // unlock Mutex
  }
};

/**
 * Transfer money from one account to another
 * @param {string} fromId
 * @param {string} toId
 * @param {number} amount
 * @returns {object} log of the transfer
 */
export const transfer = async (fromId, toId, amount) => {
  const release = await mutex.acquire();
  try {
    if (!accounts[fromId] || !accounts[toId]) throw new Error('One or both accounts not found');
    if (accounts[fromId].balance < amount) throw new Error('Insufficient funds');

    accounts[fromId].balance -= amount;
    accounts[toId].balance += amount;

    const log = {
      from: fromId,
      to: toId,
      amount,
      date: new Date(),
    };
    transactionLogs.push(log);
    return log;
  } finally {
    release(); // unlock Mutex
  }
};

/**
 * Get all transaction logs
 * @returns {Array} list of transaction logs
 */
export const getTransactionLogs = () => transactionLogs;
