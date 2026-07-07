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

    // Prompt dinâmico
    const prompt = `
Você é um copywriter de Elite especializado em conversão e marketing de afiliados.
Sua missão é criar uma copy (texto de venda) altamente persuasiva que faça a pessoa clicar no link e comprar.

INFORMAÇÕES DO PRODUTO:
- Nome/Título: ${productData.title}
- Descrição da loja: ${productData.description}
- Loja: ${productData.store}
- Preço encontrado: ${productData.price_current}
- Cupom disponível: ${cupom ? cupom : 'Não informado. Se não houver, crie urgência sobre o preço atual.'}
- Link de afiliado: ${productData.url}

FORMATO EXIGIDO PARA A COPY:
1. Comece com um gancho forte (Hook) que prenda a atenção (use Emojis).
2. Destaque o principal benefício do produto.
3. Gere extrema urgência ou escassez ("últimas unidades", "promoção relâmpago", "só hoje").
4. Se o cupom existir, destaque ele com letras maiúsculas. Se o preço estiver visível, reforce que está barato.
5. Faça uma Chamada para Ação (Call to Action - CTA) clara direcionando para o link.
6. Posicione o Link no final de forma destacada, exemplo: 🔗 Compre aqui: [LINK]

ESTILO SOLICITADO: "${style}". 
(Adapte o tom da mensagem. Ex: Se for WhatsApp, faça mensagens curtas, como se fosse um amigo indicando. Se for Instagram, use uma pegada de Story/Post. Se for Engraçado, conte uma piada antes. Se for Urgência, seja direto e agressivo no desconto).

IMPORTANTE: 
- NUNCA invente preços exatos em reais se não foram passados (use termos como "com um baita desconto").
- Retorne APENAS o texto da copy finalizado, sem introduções suas. Use quebras de linha reais para facilitar a leitura.
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