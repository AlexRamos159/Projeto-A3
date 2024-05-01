import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Resposta from './components/Resposta';
import InputReceita from './components/InputReceita';
import Botao from './components/Botao';
import { chamarAPI } from './APIs';

const App = () => {
  const [texto, setTexto] = useState('');

  const handleChange = (event) => {
    setTexto(event.target.value);
  }

  const handleClick = () => {
    fetch('localhost:4000')
    chamarAPI(texto)
    .then (data => {
      setTexto(data)
    })
    .catch (error => {
      console.log('Erro ao chamar a API: ', error);
    })
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
        <Botao handleClick={handleClick} />
      </div>
      <div className="saida">
        <Resposta />
      </div>
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)