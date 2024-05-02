const { OpenAI } = require('openai');
const path = require('path-browserify');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI(apiKey);

const chamarAPI = async (prompt) => {
    try {
        const prePrompt = "Por favor, caso seja uma receita válida, prepare a seguinte receita no formato 'título, ingredientes e modo de preparo': "
        prompt = prePrompt + prompt;

        const model = 'gpt-3.5-turbo';
        const role = 'user';
        const completion = await openai.chat.completions.create({
            messages: [{ role: role, content: prompt }],
            model: model
        });
        const resposta = completion.choices[0].message.content;
        return resposta;
    } catch (error) {
        console.error('Erro ao chamar a API:', error);
        throw error;
    }
};

module.exports = {
    chamarAPI
};
