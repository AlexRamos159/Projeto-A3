import React from 'react';
import styles from './styles/Resposta.module.css'
import BotaoFavoritar from './BotaoFavoritar';

const Resposta = ({ resposta }) => {
  if (!resposta) {
    return <p></p>;
  }

  const linhas = resposta.split('\n');

  let titulo = '';
  let ingredientes = [];
  let modoPreparo = [];
  let isModoPreparo = false;

  linhas.forEach((linha) => {
    if (linha.startsWith('Título:')) {
      titulo = linha.replace('Título:', '').trim();
    } else if (linha.startsWith('Ingredientes:') || linha.startsWith('Ingredientes')) {
      isModoPreparo = false;
    } else if (linha.startsWith('Modo de Preparo:') || linha.startsWith('Modo de Preparo')) {
      isModoPreparo = true;
    } else {
      if (!isModoPreparo && linha.trim() !== '') {
        const ingrediente = linha.trim().replace(/^\s*-\s*/, '');
        ingredientes.push(ingrediente);
      } else if (isModoPreparo) {
        const passo = linha.trim().replace(/^\s*-\s*/, '');
        modoPreparo.push(passo);
      }
    }
  });

  return (
    <div className={styles.resposta}>
      <h2 className={styles.titulo}>{titulo}</h2>

      <h3>Ingredientes:</h3>
      <ul className={styles.ingredientes}>
        {ingredientes.map((ingrediente, index) => (
          <li key={index}>{ingrediente}</li>
        ))}
      </ul>

      <h3>Modo de Preparo:</h3>
      <ol className={styles.modoPreparo}>
        {modoPreparo.map((passo, index) => (
          <li key={index}>{passo}</li>
        ))}
      </ol>
      <BotaoFavoritar titulo={titulo} ingredientes={ingredientes} modoPreparo={modoPreparo} />
    </div>
  );
};

export default Resposta;
