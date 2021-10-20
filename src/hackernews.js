const parseUrl = require('url').parse;
const got = require('got');
const cheerio = require('cheerio');

const URL = process.env.HACKERNEWS_URL;

/**
 * @typedef Entry
 * @property title {string}
 * @property href {string}
 * @property id {string}
 * @property score {number}
 * @property user {string}
 * @property comments {number}
 * @property host {string}
 *
 * @typedef Page
 * @property url {string}
 * @property entries {Entry[]}
 *
 * @param limit {number}
 * @returns {Promise<Page>}
 */
async function scrape(limit) {
    const res = await got(URL);
    if (res.statusCode !== 200) {
        throw new Error(`bad response: url: ${URL}; response code: ${res.statusCode}`);
    }
    const $ = cheerio.load(res.body);
    const entries = $('table.itemlist tr.athing').
        slice(0, limit).
        map((_, el) => entry($(el))).
        toArray();
    return {
        url: URL, entries
    };
}

/**
 * Parses given cheerio element into an {Entry} object and returns it.
 * @param {CheerioElement} el cheerio element
 * @returns {Entry} object representing parsed cheerio element
 */
function entry($el) {
    const $a = $el.find('a.titlelink');
    const $nxt = $el.next();

    const title = $a.text();
    const id = $el.attr('id');
    const href = $a.attr('href');

    if (id === null || title === null || href === null) {
        throw new Error(`null pointer: ${{ id, title, href }}`);
    }

    // fix relative href
    let $href = parseUrl(href);
    if ($href.protocol === null) {
        $href = parseUrl(`${URL}/${href}`);
    }

    const score = parseInt($nxt.find('.score').text().split(' ')[0], 10);
    const user = $nxt.find('.hnuser').text();
    const comments = parseInt($nxt.find("[href^='item?id=']").last().text().replace(/[^0-9]/g, ''), 10);
    const host = $href.host.startsWith('www.') ? $href.host.substring(4) : $href.host;
    return {
        title, href: $href.href, id, score, user, comments, host
    };
}

module.exports = { scrape };

// todo: skip "career" stories; sometimes hn publishes career stories on the frontpage.
// career stories do not have any user and score attributes, so those 2 attributes are parsed
// as empty strings.
