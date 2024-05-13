import React from 'react';
import logo from './assets/Logo-ChefIA.ico'
import styles from './Header.module.css'

const Header = () => {
    return (
        <header>
            <div>
                <img className= {styles.icon} src={logo} alt="Ícone ChefIA" />
                <ul className={styles.header}>
                    <li>Favoritos</li>
                    <li>Login</li>
                </ul>
            </div>
        </header>
    )
}

export default Header