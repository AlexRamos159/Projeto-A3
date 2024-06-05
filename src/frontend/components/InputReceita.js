import React from 'react';
import styles from './styles/InputReceita.module.css'

const InputReceita = (props) => {
    return (
        <div>
            <input className={styles.inputReceita} type="text" value={props.value} onChange={props.onChange} />
        </div>
    );
}

export default InputReceita;
