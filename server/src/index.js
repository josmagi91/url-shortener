const dotenv = require('dotenv');

if (process.env.NODE_ENV) {
  dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
  console.log(`Using .env.${process.env.NODE_ENV}`);
} else {
  dotenv.config();
  console.log('Using .env');
}

const app = require('./app');

const DEFAULT_PORT = 5000;
const PORT = process.env.PORT || DEFAULT_PORT;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
