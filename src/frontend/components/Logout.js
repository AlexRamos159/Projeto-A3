import React  from "react";
import styles from './styles/Logout.module.css'

const Logout = ( { username, handleLogout } ) => {
    return (
        <div>
            <p className={styles.title}>Você deseja mesmo sair, {username}?</p>
            <button className={styles.botao} onClick={handleLogout}>Logout</button>
        </div>
    )
}

export default Logout