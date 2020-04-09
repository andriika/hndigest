const { createClient } = require('tumblr.js');

const client = createClient({
    consumer_key: process.env.TUMBLR_CONSUMER_KEY,
    consumer_secret: process.env.TUMBLR_CONSUMER_SECRET,
    token: process.env.TUMBLR_TOKEN,
    token_secret: process.env.TUMBLR_TOKEN_SECRET
});

/**
 * @typedef { import('./hackernews').Page } Page
 *
 * @param {Page} page page to publish
 * @param {Date} ts publishing date
 * @returns {Promise<*>} publishing response
 */
async function publish(page, ts) {
    const dateString = ts.toLocaleDateString('en-us', { year: 'numeric', month: 'short', day: 'numeric' });
    const { body, tags } = parsePage(page);
    const options = {
        type: 'text',
        format: 'markdown',
        title: `Hacker News top 10 for ${dateString}`,
        body,
        tags
    };
    return new Promise((resolve, reject) => {
        client.createTextPost(process.env.TUMBLR_BLOG, options, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

/**
 * @param {Page} page
 */
function parsePage(page) {
    let body = '';
    let i = 1;
    const tags = new Set();
    // eslint-disable-next-line no-restricted-syntax
    for (const entry of page.entries) {
        const line = `${i}. [${entry.title}](${entry.href})<br><small>${entry.score} points by [${entry.user}](${page.url}/user?id=${entry.user}), [${entry.comments} comments](${page.url}/item?id=${entry.id})</small>`;
        body = `${body}${line}\n`;
        i += 1;
        tags.add(entry.host);
    }
    return {
        body,
        tags: Array.from(tags).join(',')
    };
}

module.exports = { publish };
