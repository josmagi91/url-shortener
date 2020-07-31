const {MongoClient} = require('mongodb');

let _client;
const client = {
    db: new Promise((resolve, reject) => {
        MongoClient.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true})
        .then(client => {
            _client = client;
            resolve(client.db(process.env.DB_NAME));
        }).catch(err => {
            reject(err);
        });
    }),
    close: () => {
        _client.close();
    }
}

module.exports = client;
