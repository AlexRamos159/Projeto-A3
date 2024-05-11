// App.js
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Resposta from './components/Resposta';
import InputReceita from './components/InputReceita';
import Botao from './components/Botao';

const App = () => {
    const [texto, setTexto] = useState('');
    const [resposta, setResposta] = useState('');

    const handleChange = (event) => {
        setTexto(event.target.value);
    }

    return (
        <div>
            <h1>ChefIA</h1>
            <div className="entrada">
                <InputReceita value={texto} onChange={handleChange} />
                <Botao setResposta={setResposta} texto={texto} />
            </div>
            <div className="saida">
                <Resposta resposta={resposta} />
            </div>
        </div>
    );
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
