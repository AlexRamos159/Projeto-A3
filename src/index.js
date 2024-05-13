import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Header from './components/Header'
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
            <Header />
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

createRoot(document.getElementById('root')).render(<App />);
