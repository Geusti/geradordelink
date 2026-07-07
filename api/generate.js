const { scrapeProduct } = require('../lib/scraper');
const { generateCopy } = require('../lib/gemini');

export default async function handler(req, res) {
    // Adiciona headers para CORS caso precise ser chamado de fora no futuro
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,POST');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Método não permitido. Utilize POST." });
    }

    const { url, cupom, style } = req.body;

    if (!url || !url.startsWith('http')) {
        return res.status(400).json({ error: "Forneça uma URL válida começando com http ou https." });
    }

    try {
        // 1. Extrai os dados do produto usando o Scraper
        const product = await scrapeProduct(url);
        
        // 2. Gera a copy usando a IA (Gemini) com os dados extraídos
        const copy = await generateCopy(product, style || 'WhatsApp', cupom);
        
        // 3. Retorna a resposta completa contendo a copy e as informações de fallback (como imagem e título)
        return res.status(200).json({ 
            success: true,
            copy: copy, 
            product: product 
        });
    } catch (error) {
        console.error("Erro na API /generate:", error);
        return res.status(500).json({ success: false, error: "Erro interno no servidor: " + error.message });
    }
}