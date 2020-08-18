const express = require('express');
const app = express();

app.use(express.static('dist'));

const PORT = process.env.PORT || 80;
app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
});