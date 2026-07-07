const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeProduct(url) {
    try {
        // Configuramos Headers realistas para evitar bloqueios básicos
        const { data } = await axios.get(url, {
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
            },
            timeout: 10000
        });
        
        const $ = cheerio.load(data);

        // Funções auxiliares para buscar informações no HTML
        const getTitle = () => {
            return $('meta[property="og:title"]').attr('content') || 
                   $('title').text().trim() || 
                   $('h1').first().text().trim() || 
                   "Produto Incrível";
        };

        const getImage = () => {
            return $('meta[property="og:image"]').attr('content') || 
                   $('meta[itemprop="image"]').attr('content') || 
                   $('img').first().attr('src') || 
                   "";
        };

        const getDescription = () => {
            return $('meta[property="og:description"]').attr('content') || 
                   $('meta[name="description"]').attr('content') || 
                   "Aproveite esta excelente oferta.";
        };

        // Algumas lojas deixam os preços no JSON-LD (Schema) ou em meta tags
        const getPrice = () => {
            let price = $('meta[property="product:price:amount"]').attr('content');
            if (price) return `R$ ${price}`;
            
            // Tentativa genérica de buscar preços no texto, em classes que indicam preço
            const priceText = $('[class*="price"], [id*="price"]').text();
            const matches = priceText.match(/R\$\s*\d+(?:[.,]\d+)?/g);
            if (matches && matches.length > 0) {
                // Pegar o menor valor (geralmente o preço atual)
                return matches[0];
            }
            
            return "Preço exclusivo no link";
        };

        const storeName = new URL(url).hostname.replace('www.', '').split('.')[0];
        const formattedStoreName = storeName.charAt(0).toUpperCase() + storeName.slice(1);

        return {
            title: getTitle(),
            description: getDescription(),
            price_current: getPrice(),
            image: getImage(),
            store: formattedStoreName,
            url: url
        };
    } catch (error) {
        console.error("Erro no Scraper:", error.message);
        // Fallback: se der erro, retorna pelo menos a URL e uma loja genérica. 
        // O Gemini terá que trabalhar com o que tem.
        let storeFallback = "Loja Parceira";
        try {
            storeFallback = new URL(url).hostname.replace('www.', '').split('.')[0].toUpperCase();
        } catch(e) {}
        
        return { 
            title: "Oferta Especial", 
            description: "Clique no link para descobrir essa super promoção que encontramos para você.",
            price_current: "Confira o preço clicando no link", 
            image: "https://via.placeholder.com/400x400.png?text=Oferta+Especial",
            store: storeFallback, 
            url: url 
        };
    }
}

module.exports = { scrapeProduct };