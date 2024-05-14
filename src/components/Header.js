import React from 'react';
import logo from './assets/Logo-ChefIA.ico'
import styles from './Header.module.css'
import Login from './Login'

const Header = ({isLoggedIn, toggleLoginModal, showLoginModal, setIsLoggedIn}) => {
    const handleLogin = () => {
        setIsLoggedIn(true);
        toggleLoginModal();
      };
    
    return (
        <header>
            <div>
                <img className= {styles.icon} src={logo} alt="Ícone ChefIA" />
                <ul className={styles.header}>
                    <li>Favoritos</li>
                    <li onClick={toggleLoginModal}>{isLoggedIn ? 'Sair' : 'Login'}</li>
                </ul>
            </div>
            {showLoginModal && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <span className={styles.close} onClick={toggleLoginModal}>
                            &times;
                        </span>
                        <Login handleLogin={handleLogin}/>
                    </div>
                </div>
            )}
        </header>
    )
}

export default Header