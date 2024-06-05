import React  from "react";
import styles from './Logout.module.css'

const Logout = (props) => {
    return (
        <div>
            <p className={styles.title}>Você deseja mesmo sair?</p>
            <button className={styles.botao} onClick={props.handleLogout}>Logout</button>
        </div>
    )
}

export default Logout