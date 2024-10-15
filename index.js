import express from 'express';
import bodyParser from 'body-parser';
import accountRoutes from './src/routes/accounts.js';

const PORT = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());

app.use('/api/accounts', accountRoutes);

app.listen(PORT, () => {
  console.log(`Banking system listening at http://localhost:${PORT}`);
});

export default app;
