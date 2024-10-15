import express from 'express';
import { createAccount, getBalance, deposit, withdraw, transfer, getTransactionLogs } from '../services/accounts.js';

const router = express.Router();

// Create a new account
router.post('/create', async (req, res) => {
  const { name: _name, balance: _balance } = req.body;
  try {
    const { id, name, balance } = await createAccount(_name, _balance);
    // console.log('create', { id, name, balance });
    res.status(201).json({ id, name, balance });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get account balance
router.get('/:id/balance', (req, res) => {
  const { id: _id } = req.params;
  try {
    const { id, name, balance } = getBalance(_id);
    // console.log('balance', { id, name, balance });
    res.json({ id, name, balance });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Deposit money into an account
router.post('/:id/deposit', async (req, res) => {
  const { id: _id } = req.params;
  const { amount } = req.body;
  try {
    const { id, name, balance } = await deposit(_id, amount);
    // console.log('deposit', { id, amount, name, balance });
    res.json({ id, name, balance });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Withdraw money from an account
router.post('/:id/withdraw', async (req, res) => {
  const { id: _id } = req.params;
  const { amount } = req.body;
  try {
    const { id, name, balance } = await withdraw(_id, amount);
    // console.log('withdraw', { id, amount, name, balance });
    res.json({ id, name, balance });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Transfer money from one account to another
router.post('/transfer', async (req, res) => {
  const { fromId, toId, amount } = req.body;
  try {
    const log = await transfer(fromId, toId, amount);
    // console.log('transfer', log);
    res.json(log);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get transaction logs
router.get('/logs', (req, res) => {
  // console.log('logs');
  res.json(getTransactionLogs());
});

export default router;
