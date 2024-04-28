import React from 'react';

const InputReceita = (props) => {
    return (
        <div>
            <input type="text" value={props.value} onChange={props.onChange} onKeyPress={props.onKeyPress} />
        </div>
    )
}

export default InputReceita;