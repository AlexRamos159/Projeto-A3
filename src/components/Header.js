import React from 'react';
import logo from './assets/Logo-ChefIA.ico'
import styles from './Header.module.css'
import { useAuth } from '../AuthContext';
import Login from './Login'
import Logout from './Logout'

const Header = () => {
    const { isLoggedIn, username, toggleLoginModal, toggleLogoutModal, handleLogin, handleLogout, showLoginModal, showLogoutModal } = useAuth();

    return (
        <header className={styles.header}>
            <img className={styles.icon} src={logo} alt="Ícone ChefIA" />
            <ul className={styles.headerItems}>
                <li>Favoritos</li>
                <li onClick={isLoggedIn ? toggleLogoutModal : toggleLoginModal}>
                    {isLoggedIn ? 'Logout' : 'Login'}
                </li>
            </ul>
            {showLoginModal && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <span className={styles.close} onClick={toggleLoginModal}>
                            &times;
                        </span>
                        <Login handleLogin={handleLogin} />
                    </div>
                </div>
            )}
            {showLogoutModal && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <span className={styles.close} onClick={toggleLogoutModal}>
                            &times;
                        </span>
                        <Logout handleLogout={handleLogout} />
                    </div>
                </div>
            )}
        </header >
    )
}

export default Header