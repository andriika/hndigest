const hackernews = require('./hackernews');
const mongo = require('./mongo');
const summary = require('./summary');
const tumblr = require('./tumblr');

const STORIES_LIMIT = parseInt(process.env.STORIES_LIMIT, 10);
const AGGR_PERIOD_MS = 1000 * 60 * 60 * parseInt(process.env.AGGR_PERIOD_HOURS, 10);

async function scrape(_event, context) {
    context.callbackWaitsForEmptyEventLoop = false;

    const page = await hackernews.scrape(STORIES_LIMIT);
    const pages = await mongo.pages();
    const res = await pages.insertOne({ ...page, ts: new Date() });

    delete res.connection;
    delete res.ops;
    delete res.result;
    return res;
}

/**
 * @param {*} _event aws lambda input event
 * @param {*} context aws lambda context
 * @returns  {Promise<*>}
 */
async function publish(_event, context) {
    context.callbackWaitsForEmptyEventLoop = false;
    const ts = Date.now();
    const page = await summary.aggregate(
        new Date(ts - AGGR_PERIOD_MS),
        new Date(ts),
        STORIES_LIMIT
    );
    return tumblr.publish(page, new Date(ts));
}

module.exports = { scrape, publish };
