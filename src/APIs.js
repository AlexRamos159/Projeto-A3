const { OpenAI } = require('openai');
const path = require('path-browserify');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI(OPENAI_API_KEY);

const chamarAPI = async (prompt) => {
    try {
        const model = 'gpt-3.5-turbo';
        const role = 'user';
        const completion = await openai.chat.completions.create({
            messages: [{ role: role, content: prompt }],
            model: model
        });
        const resposta = completion.choices[0].message.content;
        console.log('Resposta da API:', resposta);
        return resposta;
    } catch (error) {
        console.error('Erro ao chamar a API:', error);
        throw error;
    }
};

module.exports = {
    chamarAPI
};
