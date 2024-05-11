import React from 'react';

const Resposta = ({ resposta }) => {
  // Verifica se a resposta não está vazia
  if (!resposta) {
    return <><p></p></>;
  }

  // Divide a resposta em linhas
  const linhas = resposta.split('\n');

  // Extrai o título, os ingredientes e o modo de preparo
  let titulo = '';
  let ingredientes = [];
  let modoPreparo = [];
  let isModoPreparo = false;

  linhas.forEach((linha) => {
    if (linha.startsWith('Título:')) {
      titulo = linha.replace('Título:', '').trim();
    } else if (linha.startsWith('Ingredientes:')) {
      isModoPreparo = false;
    } else if (linha.startsWith('Modo de Preparo:')) {
      isModoPreparo = true;
    } else {
      if (!isModoPreparo && linha.trim() !== '') {
        ingredientes.push(linha.trim());
      } else if (isModoPreparo) {
        modoPreparo.push(linha.trim().replace(/^\d+\. /, ''));
      }
    }
  });

  return (
    <div>
      {/* Exibe o título */}
      <h2>{titulo}</h2>

      {/* Exibe os ingredientes */}
      <h3>Ingredientes:</h3>
      <ul>
        {ingredientes.map((ingrediente, index) => (
          <li key={index}>{ingrediente}</li>
        ))}
      </ul>

      {/* Exibe o modo de preparo */}
      <h3>Modo de Preparo:</h3>
      <ol>
        {modoPreparo.map((passo, index) => (
          <li key={index}>{passo}</li>
        ))}
      </ol>
    </div>
  );
};

export default Resposta;
