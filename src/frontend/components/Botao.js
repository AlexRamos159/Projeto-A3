import React from 'react';
import styles from './styles/Botao.module.css'

const Botao = ({ onClick, setResposta, texto }) => {
    const handleClick = () => {
        fetch('http://localhost:4000/api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: texto })
        })
        .then(response => response.json())
        .then(data => {
            setResposta(data.resposta);
        })
        .catch(error => {
            console.log('Erro ao chamar a API: ', error);
        });
    };

    return (
        <button className={styles.botao} onClick={handleClick}>Resultado</button>
    );
}

export default Botao;
