import React, { useState } from 'react';
import Header from './components/Header';
import Resposta from './components/Resposta';
import InputReceita from './components/InputReceita';
import Botao from './components/Botao';
import { AuthProvider } from './AuthContext';

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

export default App;
