import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Resposta from './components/Resposta';
import InputReceita from './components/InputReceita';
import Botao from './components/Botao';

const App = () => {
  const [texto, setTexto] = useState('');
  const [mostrarResposta, setMostrarResposta] = useState(false);

  const handleChange = (event) => {
    setTexto(event.target.value);
  }

  const handleClick = () => {
    setMostrarResposta(true);
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleClick();
    }
  };

  return (
    <div>
      <h1>ChefIA</h1>
      <div className="entrada">
        <InputReceita value={texto} onChange={handleChange} onKeyPress={handleKeyPress} />
        <Botao onClick={handleClick} />
      </div>
      <div className="saida">
        {mostrarResposta && <Resposta texto={texto} />}
      </div>
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)