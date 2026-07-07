const { scrapeProduct } = require('../lib/scraper');
const { generateCopy } = require('../lib/gemini');

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: "Método não permitido" });

    const { url, cupom, style } = req.body;

    if (!url) return res.status(400).json({ error: "URL é obrigatória" });

    try {
        const product = await scrapeProduct(url);
        const copy = await generateCopy(product, style, cupom);
        
        return res.status(200).json({ copy, product });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}