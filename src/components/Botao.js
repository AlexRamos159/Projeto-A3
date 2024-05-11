// Botao.js
import React from 'react';

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

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleClick();
        }
    };

    return (
        <button onClick={handleClick} onKeyPress={handleKeyPress}>Resultado</button>
    );
}

export default Botao;
