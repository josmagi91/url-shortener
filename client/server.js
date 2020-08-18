const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.static('dist'));

const PORT = process.env.PORT || 80;
app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
});