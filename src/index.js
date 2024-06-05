import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Header from './frontend/components/Header'
import Resposta from './frontend/components/Resposta';
import InputReceita from './frontend/components/InputReceita';
import Botao from './frontend/components/Botao';
import { AuthProvider } from './frontend/AuthContext';

const App = () => {
    const [texto, setTexto] = useState('');
    const [resposta, setResposta] = useState('');

    const handleChange = (event) => {
        setTexto(event.target.value);
    }

    return (
        <AuthProvider>
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
        </AuthProvider>
    );
}

createRoot(document.getElementById('root')).render(<App />);
