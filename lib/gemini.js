const { GoogleGenerativeAI } = require("@google/generative-ai");

async function generateCopy(productData, style, cupom) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Configurações do modelo
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
            temperature: 0.7,
            topP: 0.9,
            topK: 40,
            maxOutputTokens: 800,
        }
    });

    const prompt = `
Você é um copywriter de Elite especializado em conversão, humor inteligente e marketing de afiliados.
Sua missão é criar uma copy (texto de venda) altamente persuasiva que faça a pessoa rir e clicar no link.

DADOS DO PRODUTO:
- Nome Original: ${productData.title}
- Loja: ${productData.store}
- Preço encontrado: ${productData.price_current}
- Cupom: ${cupom ? cupom : 'Não informado'}
- Link: ${productData.url}

FORMATO DA COPY EXIGIDO:
1. COMEÇO: Crie um TÍTULO ENGRAÇADO, inusitado ou criativo sobre o produto (relacione o produto com situações do cotidiano, problemas reais de forma cômica).
2. DESENVOLVIMENTO: Destaque o benefício do produto prendendo a atenção. Use escassez ou urgência se o preço for muito bom.
3. INSTRUÇÃO ANTI-REPETIÇÃO: Seja EXTREMAMENTE criativo. Nunca use a mesma estrutura sempre. Varie o vocabulário, seja humano, use gírias leves da internet, seja imprevisível, não pareça um robô.
4. FECHAMENTO: Uma Call to Action (CTA) forte direcionando para o link (exemplo: 🔗 Leva logo: [LINK]).
5. MANTENHA o cupom e preço evidentes se eles existirem.

ESTILO SOLICITADO: "${style}". Adapte a linguagem.
IMPORTANTE: 
- NUNCA invente preços em reais se não foram passados.
- Traga humor logo no título!
- Retorne APENAS o texto da copy finalizado, sem recados.
`;

    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("Erro no Gemini:", error);
        return "🚨 Atenção! Encontramos uma super oferta na " + productData.store + "!\n\n" +
               "🔥 " + productData.title + "\n\n" +
               "👉 Confira todos os detalhes (e aproveite antes que acabe) acessando o link abaixo:\n" +
               "🔗 " + productData.url;
    }
}

module.exports = { generateCopy };