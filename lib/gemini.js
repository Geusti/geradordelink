const { GoogleGenerativeAI } = require("@google/generative-ai");

async function generateCopy(productData, style, cupom) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
        Você é um copywriter profissional de marketing de afiliados.
        Crie uma copy de venda altamente persuasiva.
        Estilo: ${style}
        Produto: ${productData.title}
        Loja: ${productData.store}
        Preço: ${productData.price_current}
        Cupom: ${cupom || 'Não informado'}
        Link: ${productData.url}

        Regras:
        - Use emojis chamativos.
        - Foco em urgência e benefício.
        - Não invente preços que não foram passados.
        - Retorne apenas o texto pronto para copiar.
    `;

    const result = await model.generateContent(prompt);
    return result.response.text();
}

module.exports = { generateCopy };