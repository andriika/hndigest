const mongo = require('./mongo');

/**
 * @typedef { import('./hackernews').Page } Page
 *
 * @param {Date} from
 * @param {Date} to
 * @param {number} limit
 * @returns {Promise<Page>}
 */
async function aggregate(from, to, limit) {
    const pages = await mongo.pages();
    const cursor = pages.aggregate(pipeline(from, to, limit));
    try {
        return await cursor.next();
    } finally {
        await cursor.close();
    }
}

function pipeline(from, to, limit) {

    const entries = [
        {
            $group: {
                _id: '$entries.id',
                totalScore: { $sum: '$entries.score' },
                score: { $max: '$entries.score' },
                title: { $first: '$entries.title' },
                href: { $first: '$entries.href' },
                host: { $first: '$entries.host' },
                comments: { $max: '$entries.comments' },
                user: { $first: '$entries.user' }
            }
        },
        { $sort: { totalScore: -1 } },
        { $limit: limit },
        {
            $project: {
                id: '$_id',
                _id: 0,
                title: 1,
                score: 1,
                href: 1,
                user: 1,
                comments: 1,
                host: 1
            }
        }
    ];

    return [
        { $match: { ts: { $gte: from, $lt: to } } },
        { $unwind: { path: '$entries' } },
        {
            $facet: {
                entry0: [
                    { $limit: 1 }
                ],
                entries
            }
        },
        {
            $project: {
                url: { $arrayElemAt: ['$entry0.url', 0] },
                entries: 1
            }
        }
    ];
}

module.exports = { aggregate };
