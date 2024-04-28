import React from 'react';

const Botao = (props) => {
    return (
        <div>
            <button onClick={props.onClick}>Resultado</button>
        </div>
    )
}

export default Botao;