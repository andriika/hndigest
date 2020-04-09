const { MongoClient } = require('mongodb');

/** @type MongoClient */
let conn = null;

/**
 * Connects to MongoDB using connection string URI defined in process.env.MONGO_URI and returns
 * {MongoClient} instance. {MongoClient} instance is cached so performing connect() twice will
 * return the same instance.
 * @returns {Promise<MongoClient>} connection
 * @see https://www.mongodb.com/blog/post/optimizing-aws-lambda-performance-with-mongodb-atlas-and-nodejs
 */
async function connect() {
    if (conn === null || !conn.isConnected()) {
        conn = await MongoClient.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }
    return conn;
}

/**
 * @typedef { import('mongodb').Collection } Collection
 * @returns {Promise<Collection>}
 */
async function pages() {
    return (await connect()).db(process.env.MONGO_DB).collection('pages');
}

module.exports = { connect, pages };
