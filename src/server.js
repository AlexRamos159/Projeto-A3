const { chamarAPI } = require("./APIs")
const express = require('express')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send('Servidor Node.js funcionando!');
});

app.get('/api', (req, res) => {
    res.send('Servidor Node.js funcionando!');
});

app.post('/api', (req, res) => {
    const { prompt } = req.body;
    chamarAPI(prompt)
        .then(data => {
            res.json({ resposta: data });
        })
        .catch(error => {
            console.error("Erro ao chamar a API: ", error)
            res.status(500).json({error: 'Erro ao chamar a API'});
        })
});

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
})