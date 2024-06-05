const { OpenAI } = require('openai');
const path = require('path-browserify');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI(apiKey);

const chamarAPI = async (prompt) => {
    try {
        const prePrompt = `
        Por favor, siga as instruções abaixo para fornecer orientações básicas e genéricas de uma receita:

        1. Título: [Digite o título da receita]
        2. Ingredientes:
           - [Lista de ingredientes separados por linha]
        3. Modo de Preparo:
           1. [Primeiro passo do modo de preparo]
           2. [Segundo passo do modo de preparo]
           3. [Terceiro passo do modo de preparo]
           ...

        Exemplo:

        Título: Bolo de Chocolate
        Ingredientes:
           - 2 xícaras de farinha de trigo
           - 1 xícara de açúcar
           - 1 xícara de chocolate em pó
           - ...
        Modo de Preparo:
           1. Pré-aqueça o forno a 180°C.
           2. Em uma tigela, misture a farinha de trigo, o açúcar e o chocolate em pó.
           3. Adicione o leite, o óleo e os ovos, misturando bem até obter uma massa homogênea.
           4. ...

        A receita desejada é: `
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
