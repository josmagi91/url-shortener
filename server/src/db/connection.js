const { MongoClient } = require('mongodb');

let clientInstance;
module.exports = {
  db: new Promise((resolve, reject) => {
    MongoClient.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
      .then((client) => {
        clientInstance = client;
        resolve(client.db(process.env.DB_NAME));
      }).catch((err) => {
        reject(err);
      });
  }),
  close: () => {
    clientInstance.close();
  },
};
