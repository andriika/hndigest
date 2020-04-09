process.env.MONGO_URI = 'mongodb://localhost:27017';
process.env.MONGO_DB = 'hndigest-test';
process.env.HACKERNEWS_URL = 'https://news.ycombinator.com';
process.env.STORIES_LIMIT = '10';
process.env.AGGR_PERIOD_HOURS = '24';
process.env.TUMBLR_CONSUMER_KEY = 'none';
process.env.TUMBLR_CONSUMER_SECRET = 'none';
process.env.TUMBLR_TOKEN = 'none';
process.env.TUMBLR_TOKEN_SECRET = 'none';
process.env.TUMBLR_BLOG = 'hndigest-test';

describe('scrape', () => {
    it('should scrape', async () => {
        // todo: add decent tests and jsdocs (^__^)
    });
});
