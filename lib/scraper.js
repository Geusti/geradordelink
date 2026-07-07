const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeProduct(url) {
    try {
        const { data } = await axios.get(url, {
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36' 
            },
            timeout: 8000
        });
        const $ = cheerio.load(data);

        return {
            title: $('meta[property="og:title"]').attr('content') || $('h1').text().trim(),
            price_current: $('meta[property="product:price:amount"]').attr('content') || $('[class*="price"]').first().text().trim(),
            image: $('meta[property="og:image"]').attr('content'),
            store: new URL(url).hostname.replace('www.', ''),
            url: url
        };
    } catch (error) {
        return { title: "Produto via Link", store: "Loja Online", url: url };
    }
}

module.exports = { scrapeProduct };